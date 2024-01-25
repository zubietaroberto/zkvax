// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import {UltraVerifier} from "../circuits/merkle_tree/contract/merkle_tree/plonk_vk.sol";
import "./MerkleRegistry.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Registrar is MerkleRegistry, ReentrancyGuard {
    UltraVerifier verifier;

    // we store all commitments to prevent duplicates
    mapping(bytes32 => bool) public commitments;

    event Registration(
        bytes32 indexed commitment,
        uint32 leafIndex,
        uint256 timestamp
    );

    /**
    @dev The constructor
    @param _merkleTreeHeight the height of deposits' Merkle Tree
    */
    constructor(uint32 _merkleTreeHeight) MerkleRegistry(_merkleTreeHeight) {
        verifier = new UltraVerifier();
    }

    /**
    @dev Add a new commitment to the tree
    @param _commitment the note commitment, which is PedersenHash(nullifier + secret)
    */
    function register(bytes32 _commitment) external payable nonReentrant {
        require(
            !commitments[_commitment],
            "The commitment has already been submitted"
        );

        uint32 insertedIndex = _insert(_commitment);
        commitments[_commitment] = true;

        emit Registration(_commitment, insertedIndex, block.timestamp);
    }

    /**
    @dev Check whether a leaf exists in the tree
    */
    function check(
        bytes calldata _proof,
        bytes32 _merkleRoot
    ) external payable nonReentrant returns (bool) {
        require(isKnownRoot(_merkleRoot), "Cannot find your merkle root"); // Make sure to use a recent one
        bytes32[] memory inputs = new bytes32[](2);
        inputs[0] = _merkleRoot;
        require(verifier.verify(_proof, inputs), "Invalid proof");

        return true;
    }
}
