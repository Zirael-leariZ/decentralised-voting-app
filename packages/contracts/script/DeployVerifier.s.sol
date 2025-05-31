// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/EmailAccessVerifier.sol";

contract DeployVerifier is Script {
	// Replace with the actual address of your prover contract
	address constant PROVER = 0xBa4011B617DBc8cA774dd619C55a13765B81Dd62;

	function run() external {
		vm.startBroadcast();

		EmailAccessVerifier verifier = new EmailAccessVerifier(PROVER);
		console.log("EmailAccessVerifier deployed at:", address(verifier));

		vm.stopBroadcast();
	}
}
