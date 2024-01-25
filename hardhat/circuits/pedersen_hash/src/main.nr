use dep::std;

fn main(secret: Field) -> pub Field {
    let hashed_secret = std::hash::pedersen_hash([secret]);
    hashed_secret
}

#[test]
fn test_main() {
    let result = main(0);
    assert(result == 0x2df8b940e5890e4e1377e05373fae69a1d754f6935e6a780b666947431f2cdcd);
}
