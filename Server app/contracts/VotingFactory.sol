// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./VotingRound.sol";

/// @title VotingFactory - Deploys and tracks voting rounds
contract VotingFactory {
	struct VotingMeta {
		address roundAddress;
		string name;
		string domain;
		address sponsor;
	}
	

	VotingMeta[] public rounds;

	event NewRound(
		uint256 indexed roundId,
		address indexed roundAddress,
		string name,
		string domain,
		address sponsor
	);

	/// @notice Create a new voting round contract
	/// @param _name Name of the vote
	/// @param _domain Allowed email domain
	/// @param _options List of voting options
	/// @param _duration Voting duration in seconds
	/// @param _quorum Minimum number of votes required
	/// @param _sponsor Address responsible for funding gas if needed
	function createVotingRound(
		string memory _name,
		string memory _domain,
		string[] memory _options,
		uint256 _duration,
		uint256 _quorum,
		address _sponsor
	) external returns (uint256 roundId, address roundAddress) {
		VotingRound newRound = new VotingRound(_name, _domain, _options, _duration, _quorum);

		rounds.push(
			VotingMeta({
				roundAddress: address(newRound),
				name: _name,
				domain: _domain,
				sponsor: _sponsor
			})
		);

		emit NewRound(rounds.length - 1, address(newRound), _name, _domain, _sponsor);
		return (rounds.length - 1, address(newRound));
	}

	/// @notice Returns all voting round metadata
	function getAllRounds() external view returns (VotingMeta[] memory) {
		return rounds;
	}


	/// @notice Returns round data by ID
	function getRound(uint256 roundId) external view returns (VotingMeta memory) {
		require(roundId < rounds.length, "Invalid round ID");
		return rounds[roundId];
	}

	/// @notice Returns number of created rounds
	function count() external view returns (uint256) {
		return rounds.length;
	}
}
