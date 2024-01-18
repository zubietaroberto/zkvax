use dep::std;

// Inspired by: https://github.com/ZKCamp/noir-voting/blob/2-merkle-trees/circuits/src/main.nr

fn main(root: pub Field, index: Field, hash_path: [Field; 32], secret: Field, size: Field) -> pub Field {
    let note_commitment = std::hash::pedersen_hash([secret]);
    let nullifier = std::hash::pedersen_hash([root, secret]);
    let check_root = compute_merkle_root(note_commitment, index, hash_path, size);
    assert(root == check_root);

    nullifier
}

// Inspired By: https://github.com/noir-lang/noir/blob/v0.22.0/noir_stdlib/src/merkle.nr
// Modified because "std::merkle::compute_merkle_root" version forces me to use Slices instead of Arrays.
fn compute_merkle_root(leaf: Field, index: Field, hash_path: [Field; 32], size: Field) -> Field {
    let index_bits = index.to_le_bits(size as u32);
    let mut current = leaf;
    for i in 0..size {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };
        current = std::hash::pedersen_hash([hash_left, hash_right]);
    }
    current
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

    let mut path: [Field; 32] = [0; 32];
    path[0] = commitment_0;
    path[1] = right_branch;

    let nullifier = main(
        root,
        0x01, // going from right to left because of Little Endian
        path,
        2,
        2
    );

    let expected_nullifier = std::hash::pedersen_hash([root, 2]);
    assert(nullifier == expected_nullifier);
}


// NOTE: run this with `nargo test --show-output` to show the results!
// We will precumpute the hashes for the merkle tree and use them in the circuit
// #[test]
// fn test_precompute_hashes() {
//     let size = 32;

//     let mut lastHash: Field = 0;
//     for i in 0..size {
//       lastHash = std::hash::poseidon::bn254::hash_2([lastHash, lastHash]);
//       std::println([i, lastHash]);
//     }

//     assert(lastHash == 0x2f68a1c58e257e42a17a6c61dff5551ed560b9922ab119d5ac8e184c9734ead9);
// }