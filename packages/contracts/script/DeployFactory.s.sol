// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/VotingFactory.sol";

contract DeployFactory is Script {
	function run() external {
		vm.startBroadcast();

		VotingFactory factory = new VotingFactory();
		console.log("VotingFactory deployed at:", address(factory));

		vm.stopBroadcast();
	}
}
