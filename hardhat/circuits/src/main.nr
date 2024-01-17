use dep::std;

// Inspired by: https://github.com/ZKCamp/noir-voting/blob/2-merkle-trees/circuits/src/main.nr

fn main(root: pub Field, index: Field, hash_path: [Field; 2], secret: Field, proposalId: pub Field) -> pub Field {
    let note_commitment = std::hash::pedersen_hash([secret]);
    let nullifier = std::hash::pedersen_hash([root, secret, proposalId]);
    let check_root = std::merkle::compute_merkle_root(note_commitment, index, hash_path);
    assert(root == check_root);

    nullifier
}


#[test]
fn test_valid_build_merkle_tree() {
    let commitment_0 =  std::hash::pedersen_hash([1]);
    let commitment_1 =  std::hash::pedersen_hash([2]);
    let commitment_2 =  std::hash::pedersen_hash([3]);
    let commitment_3 =  std::hash::pedersen_hash([4]);

    let left_branch = std::hash::pedersen_hash([commitment_0, commitment_1]);
    let right_branch = std::hash::pedersen_hash([commitment_2, commitment_3]);

    let root = std::hash::pedersen_hash([left_branch, right_branch]);
    
    let proposalId = 0;
    let nullifier = main(
        root,
        0,
        [commitment_1, right_branch],
        1,
        proposalId
    );

    let expected_nullifier = std::hash::pedersen_hash([root, 1, proposalId]);
    assert(nullifier == expected_nullifier);
}


// NOTE: run this with `nargo test --show-output` to show the results!
// We will precumpute the hashes for the merkle tree and use them in the circuit
#[test]
fn test_precompute_hashes() {
    let size = 32;

    let mut lastHash = std::hash::pedersen_hash([0, 0]);
    for i in 0..size {
      std::println([i, lastHash]);
      lastHash = std::hash::pedersen_hash([lastHash, lastHash]);
    }

    assert(true);
}