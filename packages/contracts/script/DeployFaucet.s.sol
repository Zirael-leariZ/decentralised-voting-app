// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/GasFaucet.sol";

contract DeployFaucet is Script {
	// Replace with the actual address of your VotingFactory contract
	address constant FACTORY_ADDRESS = 0x0CB9D32609A1cE7E22eaA61Eba83F79aE000eAD2;

	function run() external {
		vm.startBroadcast();

		GasFaucet faucet = new GasFaucet(FACTORY_ADDRESS);
		console.log("GasFaucet deployed at:", address(faucet));

		vm.stopBroadcast();
	}
}
