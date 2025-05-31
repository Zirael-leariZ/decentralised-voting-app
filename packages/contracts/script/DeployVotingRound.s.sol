// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/VotingFactory.sol";

contract DeployVotingRound is Script {

	address constant VOTING_FACTORY = 0x0CB9D32609A1cE7E22eaA61Eba83F79aE000eAD2;
	address constant EMAIL_PROVER = 0xBa4011B617DBc8cA774dd619C55a13765B81Dd62;
	// Replace with the actual addresses of your VotingFactory and EmailAccessProver contracts

	function run() external {
		vm.startBroadcast();

		VotingFactory factory = VotingFactory(VOTING_FACTORY);

		string memory name = "ETHPrague Demo Vote";
		string memory allowedDomain = "school.edu";
		address sponsor = msg.sender; // Replace with the actual sponsor address

		(uint roundId, address verifier) = factory.createRound(
			name,
			allowedDomain,
			sponsor,
			EMAIL_PROVER
		);

		console.log("New voting round created");
		console.log("Round ID:", roundId);
		console.log("Verifier address:", verifier);

		vm.stopBroadcast();
	}
}
