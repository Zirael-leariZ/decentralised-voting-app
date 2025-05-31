// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/VotingRound.sol";

contract DeployVotingRound is Script {
	function run() external {
		// Get deployment parameters from environment variables or set defaults
		string memory voteName = vm.envOr("VOTE_NAME", string("Sample Vote"));
		string memory emailDomain = vm.envOr("EMAIL_DOMAIN", string("example.com"));
		uint256 durationInSeconds = vm.envOr("DURATION_SECONDS", uint256(7 days));
		uint256 quorumCount = vm.envOr("QUORUM", uint256(10));

		// Set up voting options dynamically
		uint256 optionCount = vm.envOr("OPTION_COUNT", uint256(3));
		string[] memory votingOptions = new string[](optionCount);

		// Load options from environment variables or use defaults
		for (uint256 i = 0; i < optionCount; i++) {
			string memory envKey = string(abi.encodePacked("OPTION_", vm.toString(i + 1)));
			string memory defaultValue = string(abi.encodePacked("Option ", vm.toString(i + 1)));
			votingOptions[i] = vm.envOr(envKey, defaultValue);
		}

		// Start broadcasting transactions
		vm.startBroadcast();

		// Deploy the VotingRound contract
		VotingRound votingRound = new VotingRound(
			voteName,
			emailDomain,
			votingOptions,
			durationInSeconds,
			quorumCount
		);

		// Stop broadcasting
		vm.stopBroadcast();

		// Log deployment information
		console.log("VotingRound deployed to:", address(votingRound));
		console.log("Vote Name:", voteName);
		console.log("Email Domain:", emailDomain);
		console.log("Duration (seconds):", durationInSeconds);
		console.log("Quorum:", quorumCount);
		console.log("End Time:", votingRound.endTime());

		console.log("Voting Options:");
		for (uint i = 0; i < votingOptions.length; i++) {
			console.log("  ", i, ":", votingOptions[i]);
		}
	}

	function deployWithCustomOptions(
		string memory _name,
		string memory _domain,
		string[] memory _options,
		uint256 _durationInSeconds,
		uint256 _quorum
	) external {
		vm.startBroadcast();

		VotingRound votingRound = new VotingRound(
			_name,
			_domain,
			_options,
			_durationInSeconds,
			_quorum
		);

		vm.stopBroadcast();

		console.log("Custom VotingRound deployed to:", address(votingRound));
		console.log("Vote Name:", _name);
		console.log("Email Domain:", _domain);
		console.log("Duration (seconds):", _durationInSeconds);
		console.log("Quorum:", _quorum);
	}
}