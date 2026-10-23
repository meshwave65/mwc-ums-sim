#!/usr/bin/env python3
"""Independent client-side integrity checker for a running MWC Storage Node."""
import argparse
import hashlib
import json
import os
import sys
import urllib.error
import urllib.request


def request(base, token, path, method="GET", body=None, binary=False):
    data = body if isinstance(body, bytes) else (json.dumps(body).encode() if body is not None else None)
    headers = {"Authorization": "Bearer " + token}
    if body is not None and not isinstance(body, bytes):
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(base.rstrip("/") + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            raw = response.read()
            if binary:
                return raw, response.headers.get("X-Object-SHA256", "")
            return json.loads(raw.decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code}: {detail}") from exc


def main():
    parser = argparse.ArgumentParser(description="Executa uma verificação técnica de integridade no nó MWC")
    parser.add_argument("object_hash", help="SHA-256 do objeto já armazenado")
    parser.add_argument("--url", default="http://127.0.0.1:8787")
    parser.add_argument("--token", default=os.environ.get("MWC_NODE_TOKEN"))
    args = parser.parse_args()
    if not args.token:
        parser.error("Defina MWC_NODE_TOKEN ou --token")
    if len(args.object_hash) != 64:
        parser.error("object_hash deve ser um SHA-256 hexadecimal")
    try:
        challenge = request(args.url, args.token, "/v1/challenges", "POST",
                            {"object_hash": args.object_hash})
        data, header_hash = request(args.url, args.token, "/v1/objects/" + args.object_hash,
                                    binary=True)
        actual_hash = hashlib.sha256(data).hexdigest()
        evidence = request(args.url, args.token, "/v1/evidence", "POST", {
            "challenge_id": challenge["challenge_id"],
            "reported_hash": actual_hash,
            "reported_size": len(data),
        })
        result = {
            "validator": "mwc-validator-client",
            "challenge_id": challenge["challenge_id"],
            "nonce_received": bool(challenge.get("nonce")),
            "download_header_hash_matches": header_hash == actual_hash,
            "downloaded_hash": actual_hash,
            "downloaded_size_bytes": len(data),
            "node_evidence": evidence,
            "ums_issued": False,
            "interpretation": "technical integrity test only; not economic PoUW acceptance",
        }
        print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
        if not evidence.get("verified") or header_hash != actual_hash:
            return 2
        return 0
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
