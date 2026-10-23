#!/usr/bin/env python3
"""Two-node HTTP integration test using isolated processes and data directories.

This is a pre-VM integration test: both processes run on one GitHub-hosted runner.
It validates the HTTP boundary and storage isolation, not VM/network independence.
"""
import hashlib
import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
NODE_SCRIPT = ROOT / "node-agent" / "mwc_node.py"
TOKEN_A = "lab-node-a-token-long-enough-32chars"
TOKEN_B = "lab-node-b-token-long-enough-32chars"


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def request(url, method="GET", token=None, body=None, expected=None):
    headers = {}
    if token:
        headers["Authorization"] = "Bearer " + token
    if body is not None:
        if isinstance(body, (dict, list)):
            body = json.dumps(body).encode()
            headers["Content-Type"] = "application/json"
        headers["Content-Length"] = str(len(body))
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            status, data, headers_out = response.status, response.read(), response.headers
    except urllib.error.HTTPError as exc:
        status, data, headers_out = exc.code, exc.read(), exc.headers
    if expected is not None and status != expected:
        raise AssertionError(f"{method} {url}: expected HTTP {expected}, got {status}: {data[:300]!r}")
    return status, data, headers_out


def wait_ready(base, process):
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError(f"Node process exited early with code {process.returncode}")
        try:
            status, data, _ = request(base + "/health", expected=200)
            if json.loads(data).get("ok"):
                return
        except (OSError, urllib.error.URLError, TimeoutError, json.JSONDecodeError):
            time.sleep(0.2)
    raise TimeoutError(f"Node did not become ready: {base}")


def main():
    if not NODE_SCRIPT.is_file():
        raise FileNotFoundError(f"Node agent not found: {NODE_SCRIPT}")
    port_a, port_b = free_port(), free_port()
    while port_b == port_a:
        port_b = free_port()

    with tempfile.TemporaryDirectory(prefix="mwc-two-node-lab-") as temp:
        root = Path(temp)
        logs = []
        processes = []
        configs = [
            ("node-a", port_a, TOKEN_A),
            ("node-b", port_b, TOKEN_B),
        ]
        try:
            for name, port, token in configs:
                log_path = root / f"{name}.log"
                log_file = log_path.open("w", encoding="utf-8")
                logs.append(log_file)
                env = os.environ.copy()
                env["MWC_NODE_TOKEN"] = token
                process = subprocess.Popen(
                    [sys.executable, str(NODE_SCRIPT), "--data-dir", str(root / name),
                     "--quota-mb", "1", "--host", "127.0.0.1", "--port", str(port)],
                    cwd=ROOT, env=env, stdout=log_file, stderr=subprocess.STDOUT,
                )
                processes.append(process)

            base_a, base_b = f"http://127.0.0.1:{port_a}", f"http://127.0.0.1:{port_b}"
            wait_ready(base_a, processes[0])
            wait_ready(base_b, processes[1])

            # Auth must be required for protected status routes.
            request(base_a + "/v1/status", expected=401)
            status_a = json.loads(request(base_a + "/v1/status", token=TOKEN_A, expected=200)[1])
            status_b = json.loads(request(base_b + "/v1/status", token=TOKEN_B, expected=200)[1])
            assert status_a["node_id"] != status_b["node_id"], "Node identities must differ"

            payload = b"MWC two-process integration payload\n"
            expected_hash = hashlib.sha256(payload).hexdigest()
            request(base_a + "/v1/objects", "POST", TOKEN_A, payload, 201)

            # Node B must not see A's object until the client explicitly transfers it.
            request(base_b + f"/v1/objects/{expected_hash}", token=TOKEN_B, expected=404)
            request(base_b + "/v1/objects", "POST", TOKEN_B, payload, 201)
            _, recovered, headers = request(
                base_b + f"/v1/objects/{expected_hash}", token=TOKEN_B, expected=200
            )
            actual_hash = hashlib.sha256(recovered).hexdigest()
            assert recovered == payload, "Recovered bytes differ from payload"
            assert actual_hash == expected_hash, "Recovered SHA-256 mismatch"
            assert headers.get("X-Object-SHA256") == expected_hash, "Server hash header mismatch"

            challenge = json.loads(request(
                base_b + "/v1/challenges", "POST", TOKEN_B,
                {"object_hash": expected_hash}, 201
            )[1])
            evidence = json.loads(request(
                base_b + "/v1/evidence", "POST", TOKEN_B,
                {"challenge_id": challenge["challenge_id"],
                 "reported_hash": actual_hash, "reported_size": len(recovered)}, 200
            )[1])
            assert evidence["verified"] is True
            assert evidence["ums_issued"] is False
            request(base_b + "/v1/evidence", "POST", TOKEN_B,
                    {"challenge_id": challenge["challenge_id"],
                     "reported_hash": actual_hash, "reported_size": len(recovered)}, 409)

            result = {
                "result": "PASS",
                "test_type": "two_process_http_integration_not_two_vms",
                "node_a_id": status_a["node_id"],
                "node_b_id": status_b["node_id"],
                "separate_data_directories": True,
                "object_isolated_until_explicit_transfer": True,
                "retrieved_sha256": actual_hash,
                "authentication_required": True,
                "challenge_verified": True,
                "challenge_replay_rejected": True,
                "ums_issued": False,
                "limitations": [
                    "Both node processes ran on the same hosted runner.",
                    "This does not demonstrate VM isolation, network partition behavior, replication, or decentralization."
                ]
            }
            print(json.dumps(result, indent=2))
        finally:
            for process in processes:
                process.terminate()
            for process in processes:
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)
            for log_file in logs:
                log_file.close()


if __name__ == "__main__":
    main()
