// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {UltraVerifier} from "../circuits/contract/zkvax/plonk_vk.sol";

contract Voting {
    bytes32 merkleRoot;
    uint256 proposalCount;

    mapping(uint256 proposalId => Proposal) public proposals;
    mapping(bytes32 hash => bool isNullified) nullifiers;

    UltraVerifier verifier;

    struct Proposal {
        string description;
        uint256 deadline;
        uint256 forVotes;
        uint256 againstVotes;
    }

    constructor(bytes32 _merkleRoot, address _verifier) {
        merkleRoot = _merkleRoot;
        verifier = UltraVerifier(_verifier);
    }

    function propose(
        string memory description,
        uint deadline
    ) public returns (uint) {
        proposals[proposalCount] = Proposal(description, deadline, 0, 0);
        proposalCount += 1;

        return proposalCount;
    }

    function castVote(
        bytes calldata proof,
        uint proposalId,
        uint vote,
        bytes32 nullifierHash
    ) public returns (bool) {
        require(!nullifiers[nullifierHash], "Proof has been already submitted");
        require(
            block.timestamp < proposals[proposalId].deadline,
            "Voting period is over."
        );

        nullifiers[nullifierHash] = true;

        bytes32[] memory publicInputs = new bytes32[](3);
        publicInputs[0] = merkleRoot;
        publicInputs[1] = bytes32(proposalId);
        publicInputs[2] = nullifierHash;
        require(verifier.verify(proof, publicInputs), "Invalid proof");

        if (vote == 1) proposals[proposalId].forVotes += 1;
        else proposals[proposalId].againstVotes += 1;

        return true;
    }
}
