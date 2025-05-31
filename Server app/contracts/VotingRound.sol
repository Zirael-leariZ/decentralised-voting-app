// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title VotingRound - A simple on-chain voting round with options and quorum
contract VotingRound {
	string public name;              // Name of the voting round
	string public domain;            // Allowed email domain (for frontend info only)
	string[] public options;         // List of voting options
	uint256 public endTime;          // Timestamp when voting ends
	uint256 public quorum;           // Minimum number of votes required for validity

	mapping(uint256 => uint256) public voteCount; // Tracks number of votes per option
	mapping(address => bool) public hasVoted;     // Tracks who already voted

	address public creator;          // Address that created this voting round

	event Voted(address indexed voter, uint256 indexed option);
	event Result(uint256 winningOption, uint256 voteCount);

	/// @notice Constructor to initialize a voting round
	/// @param _name Name of the vote
	/// @param _domain Allowed email domain
	/// @param _options List of voting options
	/// @param _durationInSeconds Duration of the voting round in seconds
	/// @param _quorum Minimum number of votes for quorum
	constructor(
		string memory _name,
		string memory _domain,
		string[] memory _options,
		uint256 _durationInSeconds,
		uint256 _quorum
	) {
		require(_options.length >= 2, "At least 2 options required");

		name = _name;
		domain = _domain;
		options = _options;
		endTime = block.timestamp + _durationInSeconds;
		quorum = _quorum;
		creator = msg.sender;
	}

	/// @notice Cast a vote for a specific option
	/// @param optionIndex Index of the option to vote for
	function vote(uint256 optionIndex) external {
		require(block.timestamp <= endTime, "Voting has ended");
		require(!hasVoted[msg.sender], "Already voted");
		require(optionIndex < options.length, "Invalid option");

		voteCount[optionIndex]++;
		hasVoted[msg.sender] = true;

		emit Voted(msg.sender, optionIndex);
	}

	/// @notice Get the winning option and its vote count
	/// @return winnerIndex Index of the winning option
	/// @return winnerVotes Number of votes the winning option received
	function getResult() external view returns (uint256 winnerIndex, uint256 winnerVotes) {
		require(block.timestamp > endTime, "Voting still active");

		uint256 totalVotes;
		for (uint i = 0; i < options.length; i++) {
			totalVotes += voteCount[i];
		}

		require(totalVotes >= quorum, "Quorum not reached");

		uint256 maxVotes;
		uint256 winning;
		for (uint i = 0; i < options.length; i++) {
			if (voteCount[i] > maxVotes) {
				maxVotes = voteCount[i];
				winning = i;
			}
		}

		return (winning, maxVotes);
	}

	/// @notice Returns the total number of available voting options
	function getOptionCount() external view returns (uint256) {
		return options.length;
	}
}
