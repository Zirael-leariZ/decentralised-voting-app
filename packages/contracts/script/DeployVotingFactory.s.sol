// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/VotingFactory.sol";

contract DeployVotingFactory is Script {
function run() external {
		// 📥 Load your private key from environment
		uint256 deployerKey = vm.envUint("PRIVATE_KEY");

		vm.startBroadcast(deployerKey);

		// 🚀 Deploy the VotingFactory contract
		VotingFactory factory = new VotingFactory();
		console.log("VotingFactory deployed at:", address(factory));

		vm.stopBroadcast();
	}
}
