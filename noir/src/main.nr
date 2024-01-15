use dep::std;

// Reference code: https://github.com/ZKCamp/noir-voting/blob/2-merkle-trees/circuits/src/main.nr

fn main(root: pub Field, hash_paths: [Field; 2], index: Field, secret: Field) {
    let commitment = std::hash::pedersen_hash([secret]);
    let check_root = std::merkle::compute_merkle_root(commitment, index, hash_paths);   
    assert(check_root == root);
}

#[test]
fn main_test() {
    let comm_1 = std::hash::pedersen_hash([1]);
    let comm_2 = std::hash::pedersen_hash([2]);
    let comm_3 = std::hash::pedersen_hash([3]);
    let comm_4 = std::hash::pedersen_hash([4]);

    let left_branch = std::hash::pedersen_hash([comm_1, comm_2]);
    let right_branch = std::hash::pedersen_hash([comm_3, comm_4]);
    
    let root = std::hash::pedersen_hash([left_branch,  right_branch]);

    let hash_paths = [comm_2, right_branch];

    main(root, hash_paths, 0, 1);

    let hash_paths3 = [comm_4, left_branch];

    // For User 3
    main(root, hash_paths3, 2, 3);
}