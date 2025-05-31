// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/VotingFactory.sol";
import "../src/VotingRound.sol";
import "../src/EmailAccessVerifier.sol";
import "../src/GasFaucet.sol";

contract DeployAll is Script {
	function run() external {
		uint256 deployerKey = vm.envUint("PRIVATE_KEY");
		address prover = vm.envAddress("PROVER");

		// Voting round metadata
		string memory voteName = vm.envOr("VOTE_NAME", string("ZKVote Prague"));
		string memory emailDomain = vm.envOr("EMAIL_DOMAIN", string("example.com"));
		uint256 duration;
		try vm.envUint("DURATION_SECONDS") returns (uint256 envDuration) {
			duration = envDuration;
		} catch {
			duration = 3600; // default value
		}
		uint256 quorum;
		try vm.envUint("QUORUM") returns (uint256 envQuorum) {
			quorum = envQuorum;
		} catch {
			quorum = 3;
		}
		address sponsor;
		try vm.envAddress("SPONSOR") returns (address envSponsor) {
			sponsor = envSponsor;
		} catch {
			sponsor = msg.sender;
		}
		uint256 optionCount;
		try vm.envUint("OPTION_COUNT") returns (uint256 envOptionCount) {
			optionCount = envOptionCount;
		} catch {
			optionCount = 2;
		}
		string[] memory options = new string[](optionCount);
		for (uint i = 0; i < optionCount; i++) {
			string memory key = string(abi.encodePacked("OPTION_", vm.toString(i + 1)));
			string memory fallbackOption = string(abi.encodePacked("Option ", vm.toString(i + 1)));
			options[i] = vm.envOr(key, fallbackOption);
		}

		vm.startBroadcast(deployerKey);

		// 1. Deploy VotingFactory
		VotingFactory factory = new VotingFactory();
		console.log("VotingFactory deployed:", address(factory));

		// 2. Deploy EmailAccessVerifier
		EmailAccessVerifier verifier = new EmailAccessVerifier(prover);
		console.log("EmailAccessVerifier deployed:", address(verifier));

		// 3. Create voting round via factory
		(uint roundId, address votingRoundAddr) = factory.createVotingRound(
			voteName,
			emailDomain,
			options,
			duration,
			quorum,
			sponsor
		);
		console.log("VotingRound created via factory:");
		console.log("roundId:", roundId);
		console.log("address:", votingRoundAddr);

		// 4. Deploy Faucet linked to factory
		GasFaucet faucet = new GasFaucet(address(factory));
		console.log("GasFaucet deployed:", address(faucet));

		vm.stopBroadcast();
	}
}
