"""Tests for the MWC Storage Node's local persistence and evidence checks."""
import tempfile
import unittest
from pathlib import Path

from mwc_node import StorageNode, digest


class StorageNodeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.node = StorageNode(self.root, 16, "test-token-long-enough-for-lab")

    def tearDown(self):
        self.temp.cleanup()

    def test_store_read_and_persist_after_restart(self):
        data = b"MWC controlled storage test"
        stored = self.node.store(data)
        self.assertEqual(stored["object_hash"], digest(data))
        self.assertEqual(self.node.read(stored["object_hash"]), data)
        restarted = StorageNode(self.root, 16, "test-token-long-enough-for-lab")
        self.assertEqual(restarted.read(stored["object_hash"]), data)
        self.assertEqual(restarted.status()["objects"], 1)

    def test_quota_is_enforced(self):
        self.node.store(b"1234567890123456")
        with self.assertRaises(OverflowError):
            self.node.store(b"x")

    def test_challenge_evidence_and_replay_rejection(self):
        data = b"proof of stored bytes"
        key = self.node.store(data)["object_hash"]
        challenge = self.node.challenge(key)
        evidence = self.node.verify(challenge["challenge_id"], digest(data), len(data))
        self.assertTrue(evidence["verified"])
        self.assertFalse(evidence["ums_issued"])
        with self.assertRaises(RuntimeError):
            self.node.verify(challenge["challenge_id"], digest(data), len(data))

    def test_wrong_report_is_rejected(self):
        data = b"integrity mismatch"
        key = self.node.store(data)["object_hash"]
        challenge = self.node.challenge(key)
        evidence = self.node.verify(challenge["challenge_id"], "0" * 64, len(data))
        self.assertFalse(evidence["verified"])


if __name__ == "__main__":
    unittest.main()
