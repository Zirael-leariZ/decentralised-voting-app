// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/EmailAccessProver.sol";
import "../src/EmailAccessVerifier.sol";

contract Deploy is Script {
	function run() external {
		vm.startBroadcast();

		// Deploy the prover contract
		EmailAccessProver prover = new EmailAccessProver();

		// Deploy the verifier with the address of the prover
		EmailAccessVerifier verifier = new EmailAccessVerifier(address(prover));

		console.log("Prover deployed at:", address(prover));
		console.log("Verifier deployed at:", address(verifier));

		vm.stopBroadcast();
	}
}
