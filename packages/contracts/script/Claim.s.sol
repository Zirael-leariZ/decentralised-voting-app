// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

interface IVerifier {
	function claim(
		uint256[2] calldata a,
		uint256[2][2] calldata b,
		uint256[2] calldata c,
		bytes32 emailHash,
		address voter
	) external;
}

contract ClaimScript is Script {
	function run() external {
		// Load private key from env
		uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

		// Replace with your deployed Verifier address on Optimism Sepolia
		address verifierAddress = 0x8CaB7BECE9d9C49BA478550b7Fc8BBD23f004C92;
		IVerifier verifier = IVerifier(verifierAddress);

		// Dummy zkSNARK proof (replace with real one later)
		uint256[2] memory a = [
	uint256(0x1a2b3c4d5e6f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd),
	uint256(0x2b3c4d5e6f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a)
];

		uint256[2][2] memory b = [
	[
		uint256(0x3c4d5e6f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a2b),
		uint256(0x4d5e6f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a2b3c)
	],
	[
		uint256(0x5e6f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a2b3c4d),
		uint256(0x6f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a2b3c4d5e)
	]
];

		uint256[2] memory c = [
	0x7f1234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a2b3c4d5e6f,
	0x8a234567890abcdefabcdefabcdefabcdefabcdefabcdefabcd1a2b3c4d5e6f
];

bytes32 emailHash = hex"1111111111111111111111111111111111111111111111111111111111111111";
address voter = 0xC8E7f577e2ec7209d82bFa0C348326C1EC298467; // Replace with the voter's address

		vm.startBroadcast(deployerPrivateKey);
		verifier.claim(a, b, c, emailHash, voter);
		vm.stopBroadcast();
	}
}
