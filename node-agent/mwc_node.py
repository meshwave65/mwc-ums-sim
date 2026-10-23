#!/usr/bin/env python3
"""MWC Storage Node agent for controlled lab tests; no UMS issuance."""
import argparse
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import time
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


def digest(data):
    return hashlib.sha256(data).hexdigest()


class StorageNode:
    def __init__(self, root, quota, token):
        self.root = Path(root).resolve()
        self.objects = self.root / "objects"
        self.objects.mkdir(parents=True, exist_ok=True)
        self.db_path = self.root / "node.sqlite3"
        self.quota = quota
        self.token = token
        with self.db() as db:
            db.executescript("""
                CREATE TABLE IF NOT EXISTS objects(hash TEXT PRIMARY KEY, size INTEGER NOT NULL, created REAL NOT NULL);
                CREATE TABLE IF NOT EXISTS challenges(id TEXT PRIMARY KEY, hash TEXT NOT NULL, nonce TEXT NOT NULL, issued REAL NOT NULL, used REAL);
                CREATE TABLE IF NOT EXISTS evidence(id TEXT PRIMARY KEY, challenge_id TEXT UNIQUE NOT NULL, payload TEXT NOT NULL);
            """)
        self.reconcile()

    def db(self):
        self.root.mkdir(parents=True, exist_ok=True)
        return sqlite3.connect(self.db_path, timeout=10)

    def reconcile(self):
        with self.db() as db:
            db.execute("DELETE FROM objects")
            for path in self.objects.iterdir():
                if path.is_file() and len(path.name) == 64:
                    data = path.read_bytes()
                    if digest(data) == path.name:
                        db.execute("INSERT OR REPLACE INTO objects VALUES(?,?,?)",
                                   (path.name, len(data), path.stat().st_mtime))

    def usage(self):
        with self.db() as db:
            return db.execute("SELECT COALESCE(SUM(size),0) FROM objects").fetchone()[0]

    def status(self):
        with self.db() as db:
            count = db.execute("SELECT COUNT(*) FROM objects").fetchone()[0]
        used = self.usage()
        marker = self.root / "node-id"
        if not marker.exists():
            marker.write_text(str(uuid.uuid4()), encoding="utf-8")
        return {"service": "mwc-storage-node", "version": "0.1.0",
                "node_id": marker.read_text(encoding="utf-8").strip(),
                "objects": count, "used_bytes": used, "quota_bytes": self.quota,
                "free_bytes": max(0, self.quota-used), "ums_issued": False,
                "pouw_status": "not_claimed"}

    def store(self, data):
        key = digest(data)
        target = self.objects / key
        if target.exists():
            if digest(target.read_bytes()) != key:
                raise RuntimeError("Objeto existente corrompido")
            return {"object_hash": key, "size_bytes": len(data), "already_present": True}
        if self.usage() + len(data) > self.quota:
            raise OverflowError("Limite de armazenamento excedido")
        temp = self.objects / (".tmp-" + secrets.token_hex(8))
        try:
            with temp.open("xb") as stream:
                stream.write(data)
                stream.flush()
                os.fsync(stream.fileno())
            if digest(temp.read_bytes()) != key:
                raise RuntimeError("Falha de integridade após gravação")
            os.replace(temp, target)
            with self.db() as db:
                db.execute("INSERT OR IGNORE INTO objects VALUES(?,?,?)", (key, len(data), time.time()))
        finally:
            if temp.exists():
                temp.unlink()
        return {"object_hash": key, "size_bytes": len(data), "already_present": False}

    def read(self, key):
        if len(key) != 64 or any(c not in "0123456789abcdef" for c in key):
            raise ValueError("Hash SHA-256 inválido")
        data = (self.objects / key).read_bytes()
        if digest(data) != key:
            raise RuntimeError("Integridade falhou na leitura")
        return data

    def challenge(self, key):
        self.read(key)
        cid, nonce, now = str(uuid.uuid4()), secrets.token_hex(32), time.time()
        with self.db() as db:
            db.execute("INSERT INTO challenges VALUES(?,?,?,?,NULL)", (cid, key, nonce, now))
        return {"challenge_id": cid, "object_hash": key, "nonce": nonce, "issued_at": now}

    def verify(self, cid, reported_hash, reported_size):
        with self.db() as db:
            row = db.execute("SELECT hash,nonce,issued,used FROM challenges WHERE id=?", (cid,)).fetchone()
            if row is None:
                raise KeyError("Desafio inexistente")
            if row[3] is not None:
                raise RuntimeError("Desafio já consumido; replay recusado")
            data = self.read(row[0])
            actual, size, now = digest(data), len(data), time.time()
            ok = actual == row[0] and reported_hash == actual and reported_size == size
            evidence = {"evidence_id": str(uuid.uuid4()), "challenge_id": cid,
                        "node_id": self.status()["node_id"], "object_hash": actual,
                        "size_bytes": size, "reported_hash": reported_hash,
                        "reported_size": reported_size, "nonce": row[1],
                        "issued_at": row[2], "verified_at": now, "verified": ok,
                        "verification_method": "server-re-read-and-sha256",
                        "pouw_status": "technical_integrity_check_only", "ums_issued": False}
            db.execute("UPDATE challenges SET used=? WHERE id=? AND used IS NULL", (now, cid))
            db.execute("INSERT INTO evidence VALUES(?,?,?)",
                       (evidence["evidence_id"], cid, json.dumps(evidence, sort_keys=True)))
            return evidence


def handler_for(node):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt, *args):
            print("%s %s" % (self.log_date_time_string(), fmt % args))

        def send_json(self, status, value):
            body = json.dumps(value, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def authorized(self):
            return hmac.compare_digest(self.headers.get("Authorization", ""), "Bearer " + node.token)

        def do_GET(self):
            path = urlparse(self.path).path
            if path == "/health":
                return self.send_json(200, {"ok": True})
            if not self.authorized():
                return self.send_json(401, {"error": "Autenticação necessária"})
            if path == "/v1/status":
                return self.send_json(200, node.status())
            if path.startswith("/v1/objects/"):
                try:
                    data = node.read(path.rsplit("/", 1)[-1])
                except FileNotFoundError:
                    return self.send_json(404, {"error": "Objeto não encontrado"})
                except (ValueError, RuntimeError) as exc:
                    return self.send_json(422, {"error": str(exc)})
                self.send_response(200)
                self.send_header("Content-Type", "application/octet-stream")
                self.send_header("Content-Length", str(len(data)))
                self.send_header("X-Object-SHA256", digest(data))
                self.end_headers()
                self.wfile.write(data)
                return
            return self.send_json(404, {"error": "Rota não encontrada"})

        def do_POST(self):
            if not self.authorized():
                return self.send_json(401, {"error": "Autenticação necessária"})
            path = urlparse(self.path).path
            length = int(self.headers.get("Content-Length", "0"))
            if length < 0 or length > node.quota:
                return self.send_json(413, {"error": "Tamanho excede limite"})
            raw = self.rfile.read(length)
            try:
                if path == "/v1/objects":
                    return self.send_json(201, node.store(raw))
                payload = json.loads(raw or b"{}")
                if path == "/v1/challenges":
                    return self.send_json(201, node.challenge(str(payload.get("object_hash", ""))))
                if path == "/v1/evidence":
                    result = node.verify(str(payload.get("challenge_id", "")),
                                         str(payload.get("reported_hash", "")),
                                         int(payload.get("reported_size", -1)))
                    return self.send_json(200 if result["verified"] else 422, result)
                return self.send_json(404, {"error": "Rota não encontrada"})
            except OverflowError as exc:
                return self.send_json(413, {"error": str(exc)})
            except KeyError as exc:
                return self.send_json(404, {"error": str(exc)})
            except (ValueError, json.JSONDecodeError) as exc:
                return self.send_json(400, {"error": str(exc)})
            except RuntimeError as exc:
                return self.send_json(409, {"error": str(exc)})
            except Exception as exc:
                return self.send_json(500, {"error": type(exc).__name__})

    return Handler


def main():
    parser = argparse.ArgumentParser(description="Agente de armazenamento MWC para laboratório")
    parser.add_argument("--data-dir", default="./mwc-node-data")
    parser.add_argument("--quota-mb", type=int, default=1024)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8787)
    parser.add_argument("--token", default=os.environ.get("MWC_NODE_TOKEN"))
    args = parser.parse_args()
    if args.quota_mb < 1:
        parser.error("--quota-mb deve ser >= 1")
    if not args.token or len(args.token) < 24:
        parser.error("Defina MWC_NODE_TOKEN ou --token com pelo menos 24 caracteres")
    if args.host not in ("127.0.0.1", "localhost", "::1") and not os.environ.get("MWC_NODE_ALLOW_REMOTE"):
        parser.error("Escuta remota exige definir MWC_NODE_ALLOW_REMOTE=1 e proteger a rede")
    node = StorageNode(args.data_dir, args.quota_mb * 1024 * 1024, args.token)
    server = ThreadingHTTPServer((args.host, args.port), handler_for(node))
    print(json.dumps({"event": "node_started", **node.status(), "host": args.host, "port": args.port}))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
