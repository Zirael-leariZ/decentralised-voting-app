// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract VotingFactory {
	struct VotingRound {
		address verifier;
		string name;
		string allowedDomain;
		address sponsor;
	}

	VotingRound[] public rounds;

	event NewRound(
		uint indexed id,
		address verifier,
		string name,
		string domain,
		address sponsor
	);

	function createRound(
		string memory _name,
		string memory _allowedDomain,
		address _sponsor,
		address _verifier
	) external returns (uint roundId) {
		rounds.push(VotingRound({
			verifier: _verifier,
			name: _name,
			allowedDomain: _allowedDomain,
			sponsor: _sponsor
		}));

		emit NewRound(rounds.length - 1, _verifier, _name, _allowedDomain, _sponsor);
		return rounds.length - 1;
	}

	function getRounds() external view returns (VotingRound[] memory) {
		return rounds;
	}

	function getVerifier(uint roundId) external view returns (address) {
		require(roundId < rounds.length, "Invalid round");
		return rounds[roundId].verifier;
	}
}
