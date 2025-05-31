// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Verifier, Proof} from "vlayer/Verifier.sol";
import {EmailAccessVerifier} from "./EmailAccessVerifier.sol";

contract EmailAccessVerifier is Verifier {
	address public prover;

	constructor(address _prover) {
		prover = _prover;
	}

	function claim(
		Proof calldata,
		bytes32 emailHash,
		address user
	)
		external
		onlyVerified(
			prover,
			bytes4(keccak256("main((string,string,string,string,string,string,string),address)"))
		)

	{
		emit Verified(user, emailHash);
	}

	event Verified(address indexed user, bytes32 indexed emailHash);
}