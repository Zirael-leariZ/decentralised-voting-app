// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Prover, Proof} from "vlayer/Prover.sol";
import {UnverifiedEmail, VerifiedEmail, EmailProofLib} from "vlayer/EmailProof.sol";
import {RegexLib} from "vlayer/Regex.sol";

contract EmailAccessProver is Prover {
	using RegexLib for string;
	using EmailProofLib for UnverifiedEmail;

	function main(UnverifiedEmail calldata raw, address user)
		public
		view
	returns (Proof memory, bytes32, address)
	{
		// Verify DKIM signature and parse the email content
		VerifiedEmail memory email = raw.verify();

		// Require the subject to match exactly
		require(keccak256(bytes(email.subject)) == keccak256(bytes("ZKVote Access")), "Invalid subject");


		// Extract domain from 'From:' header using regex
		string[] memory parts = email.from.capture("^[^@]+@(.+)$");
		require(parts.length == 2, "Malformed email address");
		require(keccak256(bytes(parts[1])) == keccak256(bytes("university.edu")), "Unauthorized domain");


		// Hash the email for anonymity
		bytes32 emailHash = sha256(bytes(email.from));

		// Return the ZK proof, hashed email, and user wallet address
		return (proof(), emailHash, user);
	}
}
