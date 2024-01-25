use dep::std;

fn main(secret: Field) -> pub Field {
    let hashed_secret = std::hash::poseidon::bn254::hash_1([secret]);
    hashed_secret
}

#[test]
fn test_main() {
    let result = main(0);
    assert(result == 0x2a09a9fd93c590c26b91effbb2499f07e8f7aa12e2b4940a3aed2411cb65e11c);
}
