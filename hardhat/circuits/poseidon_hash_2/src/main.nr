use dep::std;

fn main(secret1: Field, secret2: Field ) -> pub Field {
    let hashed_secret = std::hash::poseidon::bn254::hash_2([secret1, secret2]);
    hashed_secret
}

#[test]
fn test_main() {
    let result = main(0, 1);
    assert(result == 0x1bd20834f5de9830c643778a2e88a3a1363c8b9ac083d36d75bf87c49953e65e);
}
