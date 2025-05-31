// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/GasFaucet.sol";

contract DeployFaucet is Script {
	// Replace with your VotingFactory address
	address constant FACTORY_ADDRESS = 0xc7eD263dDF47ABF09089613602A436F02873C5d8;

	function run() external {
		uint256 deployerKey = vm.envUint("PRIVATE_KEY");

		vm.startBroadcast(deployerKey);

		GasFaucet faucet = new GasFaucet(FACTORY_ADDRESS);
		console.log("GasFaucet deployed at:", address(faucet));

		vm.stopBroadcast();
	}
}
