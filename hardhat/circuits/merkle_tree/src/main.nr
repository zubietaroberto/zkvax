use dep::std;

// Translation of TCash's `withdraw.circom` to Noir
fn main(
    root: pub Field,

    secret: Field,
    indices: Field,
    hash_path: [Field; 31]
) {
    let computed_root = compute_merkle_root(secret, indices, hash_path, 31);
    assert(root == computed_root);
}

// Inspired By: https://github.com/noir-lang/noir/blob/v0.22.0/noir_stdlib/src/merkle.nr
// Modified because "std::merkle::compute_merkle_root" version forces me to use Slices instead of Arrays.
fn compute_merkle_root(leaf: Field, index: Field, hash_path: [Field; 31], size: Field) -> Field {
    let index_bits = index.to_le_bits(size as u32);
    let mut current = leaf;
    for i in 0..size {
        let path_bit = index_bits[i] as bool;
        let (hash_left, hash_right) = if path_bit {
            (hash_path[i], current)
        } else {
            (current, hash_path[i])
        };
        current = std::hash::poseidon::bn254::hash_2([hash_left, hash_right]);
    }
    current
}

#[test]
fn test_valid_build_merkle_tree() {
    let commitment_0 =  std::hash::poseidon::bn254::hash_1([1]);
    let commitment_1 =  std::hash::poseidon::bn254::hash_1([2]);
    let commitment_2 =  std::hash::poseidon::bn254::hash_1([3]);
    let commitment_3 =  std::hash::poseidon::bn254::hash_1([4]);

    let left_branch = std::hash::poseidon::bn254::hash_2([commitment_0, commitment_1]);
    let right_branch = std::hash::poseidon::bn254::hash_2([commitment_2, commitment_3]);

    let root = std::hash::poseidon::bn254::hash_2([left_branch, right_branch]);

    let mut path: [Field; 31] = [0; 31];
    path[0] = commitment_0;
    path[1] = right_branch;

    let computed_root = compute_merkle_root(
        std::hash::poseidon::bn254::hash_1([2]),
        0x01, // going from right to left because of Little Endian 'to_le_bits()'
        path,
        2
    );

    assert(computed_root == root);
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

#[test]
fn test_correct_hashing() {
    let hashed_secret = 0x208bcf178d159d13b732ebfeffb7d07e0ea173bd0baf9da2a8a3690c8b761b7f; // Poseidon("test")
    let zero_0 = 0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864;
    let expected_result_0 = 0x17bbbe3dfb1b4ebf2769698ac8ce99515fec2cfe2323d69d98d19af179aceaac;

    let stem = std::hash::poseidon::bn254::hash_2([hashed_secret, zero_0]);
    assert(stem == expected_result_0);
}

#[test]
fn test_function_smoketest() {
    let hashed_secret = 0x208bcf178d159d13b732ebfeffb7d07e0ea173bd0baf9da2a8a3690c8b761b7f; // Poseidon("test")
    let initial_root = 0x188e8544a9260c8b7ca54500baee2bf639f9fc36c2f1c16172d257566c25e722;
    let hash_path = [
        0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864,
        0x1069673dcdb12263df301a6ff584a7ec261a44cb9dc68df067a4774460b1f1e1,
        0x18f43331537ee2af2e3d758d50f72106467c6eea50371dd528d57eb2b856d238,
        0x07f9d837cb17b0d36320ffe93ba52345f1b728571a568265caac97559dbc952a,
        0x2b94cf5e8746b3f5c9631f4c5df32907a699c58c94b2ad4d7b5cec1639183f55,
        0x2dee93c5a666459646ea7d22cca9e1bcfed71e6951b953611d11dda32ea09d78,
        0x078295e5a22b84e982cf601eb639597b8b0515a88cb5ac7fa8a4aabe3c87349d,
        0x2fa5e5f18f6027a6501bec864564472a616b2e274a41211a444cbe3a99f3cc61,
        0x0e884376d0d8fd21ecb780389e941f66e45e7acce3e228ab3e2156a614fcd747,
        0x1b7201da72494f1e28717ad1a52eb469f95892f957713533de6175e5da190af2,
        0x1f8d8822725e36385200c0b201249819a6e6e1e4650808b5bebc6bface7d7636,
        0x2c5d82f66c914bafb9701589ba8cfcfb6162b0a12acf88a8d0879a0471b5f85a,
        0x14c54148a0940bb820957f5adf3fa1134ef5c4aaa113f4646458f270e0bfbfd0,
        0x190d33b12f986f961e10c0ee44d8b9af11be25588cad89d416118e4bf4ebe80c,
        0x22f98aa9ce704152ac17354914ad73ed1167ae6596af510aa5b3649325e06c92,
        0x2a7c7c9b6ce5880b9f6f228d72bf6a575a526f29c66ecceef8b753d38bba7323,
        0x2e8186e558698ec1c67af9c14d463ffc470043c9c2988b954d75dd643f36b992,
        0x0f57c5571e9a4eab49e2c8cf050dae948aef6ead647392273546249d1c1ff10f,
        0x1830ee67b5fb554ad5f63d4388800e1cfe78e310697d46e43c9ce36134f72cca,
        0x2134e76ac5d21aab186c2be1dd8f84ee880a1e46eaf712f9d371b6df22191f3e,
        0x19df90ec844ebc4ffeebd866f33859b0c051d8c958ee3aa88f8f8df3db91a5b1,
        0x18cca2a66b5c0787981e69aefd84852d74af0e93ef4912b4648c05f722efe52b,
        0x2388909415230d1b4d1304d2d54f473a628338f2efad83fadf05644549d2538d,
        0x27171fb4a97b6cc0e9e8f543b5294de866a2af2c9c8d0b1d96e673e4529ed540,
        0x2ff6650540f629fd5711a0bc74fc0d28dcb230b9392583e5f8d59696dde6ae21,
        0x120c58f143d491e95902f7f5277778a2e0ad5168f6add75669932630ce611518,
        0x1f21feb70d3f21b07bf853d5e5db03071ec495a0a565a21da2d665d279483795,
        0x24be905fa71335e14c638cc0f66a8623a826e768068a9e968bb1a1dde18a72d2,
        0x0f8666b62ed17491c50ceadead57d4cd597ef3821d65c328744c74e553dac26d,
        0x0918d46bf52d98b034413f4a1a1c41594e7a7a3f6ae08cb43d1a2a230e1959ef,
        0x1bbeb01b4c479ecde76917645e404dfa2e26f90d0afc5a65128513ad375c5ff2
        // 0x2f68a1c58e257e42a17a6c61dff5551ed560b9922ab119d5ac8e184c9734ead9
    ];

    main(
        initial_root,
        hashed_secret,
        0x0000000000000000000000000000000,
        hash_path
    );
}