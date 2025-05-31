// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingFactory {
	struct Poll {
		uint256 id;
		string description;
		string[] options;
		uint256 expirationDate;
		address creator;
		mapping(address => bool) hasVoted; 
		mapping(string => uint256) votes; 
		bool completed;
	}

	uint256 public pollCounter;
	mapping(uint256 => Poll) public polls;

	event PollCreated(uint256 pollId, string description, string[] options, uint256 expirationDate);
	event VoteCasted(uint256 pollId, string option, address voter);

	// Создание нового опроса
	function createPoll(string memory _description, string[] memory _options, uint256 _duration) public {
		pollCounter++;
		Poll storage newPoll = polls[pollCounter];
		newPoll.id = pollCounter;
		newPoll.description = _description;
		newPoll.options = _options;
		newPoll.expirationDate = block.timestamp + _duration;
		newPoll.creator = msg.sender;
		newPoll.completed = false;

		emit PollCreated(pollCounter, _description, _options, newPoll.expirationDate);
	}

	function vote(uint256 _pollId, string memory _option) public {
		Poll storage poll = polls[_pollId];

		require(block.timestamp < poll.expirationDate, "Voting period has ended.");
		require(!poll.hasVoted[msg.sender], "You have already voted.");
		
		bool validOption = false;
		for (uint i = 0; i < poll.options.length; i++) {
			if (keccak256(abi.encodePacked(poll.options[i])) == keccak256(abi.encodePacked(_option))) {
				validOption = true;
				break;
			}
		}
		require(validOption, "Invalid vote option.");

		poll.votes[_option]++;
		poll.hasVoted[msg.sender] = true;

		emit VoteCasted(_pollId, _option, msg.sender);
	}

	// Получение результатов голосования
	function getResults(uint256 _pollId) public view returns (string[] memory options, uint256[] memory votes) {
		Poll storage poll = polls[_pollId];

		options = poll.options;
		votes = new uint256[](poll.options.length);
		for (uint i = 0; i < poll.options.length; i++) {
			votes[i] = poll.votes[poll.options[i]];
		}
	}
}