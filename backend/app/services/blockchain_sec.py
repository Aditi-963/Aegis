import hashlib
import json
from datetime import datetime
from typing import Dict, Any, List

class CryptographicLedger:
    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        # Create genesis block
        self._create_block(block_index=0, session_id=0, telemetry_summary="GENESIS", previous_hash="0"*64)

    def _create_block(self, block_index: int, session_id: int, telemetry_summary: Any, previous_hash: str) -> Dict[str, Any]:
        block = {
            "block_index": block_index,
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "telemetry_summary": telemetry_summary,
            "previous_hash": previous_hash,
            "hash": ""
        }
        block["hash"] = self._calculate_hash(block)
        self.chain.append(block)
        return block

    def _calculate_hash(self, block: Dict[str, Any]) -> str:
        # Exclude hash field itself for hashing
        hash_dict = {
            "block_index": block["block_index"],
            "session_id": block["session_id"],
            "timestamp": block["timestamp"],
            "telemetry_summary": block["telemetry_summary"],
            "previous_hash": block["previous_hash"]
        }
        encoded_block = json.dumps(hash_dict, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def record_telemetry_block(self, session_id: int, telemetry_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compresses and adds a new sector telemetry block to the secure cryptographic ledger.
        """
        previous_hash = "0"*64 if not self.chain else self.chain[-1]["hash"]
        next_index = len(self.chain)

        # Simplify telemetry state to reduce block size while maintaining core variables
        telemetry_summary = {
            "lap": telemetry_state.get("lap"),
            "sector": telemetry_state.get("sector"),
            "speed": telemetry_state.get("speed"),
            "tire_wear_avg": telemetry_state.get("tire_wear_avg"),
            "hrp_score": telemetry_state.get("hrp_score"),
            "cognitive_efficiency": telemetry_state.get("cognitive_efficiency"),
            "fuel_load": telemetry_state.get("fuel_load"),
            "elapsed_time": telemetry_state.get("elapsed_time")
        }

        return self._create_block(
            block_index=next_index,
            session_id=session_id,
            telemetry_summary=telemetry_summary,
            previous_hash=previous_hash
        )

    def verify_chain(self) -> bool:
        """
        Iterates over the chain to ensure the hashes match and previous_hash links are untampered.
        """
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            # Re-calculate hash
            if current["hash"] != self._calculate_hash(current):
                return False

            # Verify block linkage
            if current["previous_hash"] != previous["hash"]:
                return False

        return True
