// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./VotingFactory.sol";
import "./VotingRound.sol";

/// @title GasFaucet - Sends gas to verified voters once per round
contract GasFaucet {
	VotingFactory public factory;

	uint256 public constant GAS_AMOUNT = 0.0001 ether;

	// roundId => user => claimed
	mapping(uint256 => mapping(address => bool)) public hasClaimed;

	event GasClaimed(uint256 indexed roundId, address indexed user, uint256 amount);

	constructor(address _factory) {
		factory = VotingFactory(_factory);
	}

	/// @notice Claim gas for a specific round if not already claimed
	function claimGas(uint256 roundId) external {
		require(!hasClaimed[roundId][msg.sender], "Already claimed");

		// Get the round contract address
		(address roundAddress, , , ) = factory.rounds(roundId);
		VotingRound round = VotingRound(roundAddress);

		// Require that user has voted in that round
		require(round.hasVoted(msg.sender), "Must vote first");

		hasClaimed[roundId][msg.sender] = true;

		require(address(this).balance >= GAS_AMOUNT, "Faucet empty");
		(bool success, ) = msg.sender.call{value: GAS_AMOUNT}("");
		require(success, "Gas send failed");

		emit GasClaimed(roundId, msg.sender, GAS_AMOUNT);
	}

	/// @notice Allow contract to receive ETH
	receive() external payable {}
}
