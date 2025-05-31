// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./VotingFactory.sol";
import "./EmailAccessVerifier.sol";

contract GasFaucet {
	VotingFactory public factory;
	uint public constant GAS_AMOUNT = 0.0001 ether;

	mapping(uint => mapping(address => bool)) public hasClaimedGas;

	event GasClaimed(uint indexed roundId, address indexed user, uint amount);

	constructor(address _factory) {
		factory = VotingFactory(_factory);
	}

	function claimGas(uint roundId, bytes32 emailHash) external {
		require(!hasClaimedGas[roundId][msg.sender], "Already claimed");

		address verifierAddr = factory.getVerifier(roundId);
		EmailAccessVerifier verifier = EmailAccessVerifier(verifierAddr);

		require(verifier.isVerified(emailHash, msg.sender), "Not verified");

		hasClaimedGas[roundId][msg.sender] = true;
		require(address(this).balance >= GAS_AMOUNT, "Faucet empty");

		(bool sent, ) = msg.sender.call{value: GAS_AMOUNT}("");
		require(sent, "Transfer failed");

		emit GasClaimed(roundId, msg.sender, GAS_AMOUNT);
	}

	receive() external payable {}
}
