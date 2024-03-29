// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "poseidon-sol/contracts/Poseidon.sol";

/** Inspired by "MerkleWithHistory" from the "TCash" project, but using Poseidon instead of MiMC */
contract MerkleRegistry {
    uint32 levels;
    Poseidon hasher;

    // filledSubtrees and roots could be bytes32[size], but using mappings makes it cheaper because
    // it removes index range check on every interaction
    mapping(uint256 => bytes32) public filledSubtrees;
    mapping(uint256 => bytes32) public roots;
    uint32 public constant ROOT_HISTORY_SIZE = 30;
    uint32 public currentRootIndex = 0;
    uint32 public nextIndex = 0;

    constructor(uint32 _levels) {
        require(_levels > 0, "_levels should be greater than zero");
        require(_levels < 32, "_levels should be less than 32");
        levels = _levels;
        hasher = new Poseidon();

        for (uint32 i = 0; i < _levels; i++) {
            filledSubtrees[i] = zeros(i);
        }

        roots[0] = zeros(_levels - 1);
    }

    /** @dev Hash 2 tree leaves, returns Poseidon(_left, _right) **/
    function hashLeftRight(
        uint256 _left,
        uint256 _right
    ) public view returns (uint256) {
        return hasher.hash([_left, _right]);
    }

    function _insert(bytes32 _leaf) internal returns (uint32 index) {
        uint32 _nextIndex = nextIndex;
        require(
            _nextIndex != uint32(2) ** levels,
            "Merkle tree is full. No more leaves can be added"
        );
        uint32 currentIndex = _nextIndex;
        bytes32 currentLevelHash = _leaf;
        bytes32 left;
        bytes32 right;

        for (uint32 i = 0; i < levels; i++) {
            if (currentIndex % 2 == 0) {
                left = currentLevelHash;
                right = zeros(i);
                filledSubtrees[i] = currentLevelHash;
            } else {
                left = filledSubtrees[i];
                right = currentLevelHash;
            }
            currentLevelHash = bytes32(
                hashLeftRight(uint256(left), uint256(right))
            );
            currentIndex /= 2;
        }

        uint32 newRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
        currentRootIndex = newRootIndex;
        roots[newRootIndex] = currentLevelHash;
        nextIndex = _nextIndex + 1;
        return _nextIndex;
    }

    /** @dev Whether the root is present in the root history */
    function isKnownRoot(bytes32 _root) public view returns (bool) {
        if (_root == 0) {
            return false;
        }
        uint32 _currentRootIndex = currentRootIndex;
        uint32 i = _currentRootIndex;
        do {
            if (_root == roots[i]) {
                return true;
            }
            if (i == 0) {
                i = ROOT_HISTORY_SIZE;
            }
            i--;
        } while (i != _currentRootIndex);
        return false;
    }

    /** @dev Returns the last root */
    function getLastRoot() public view returns (bytes32) {
        return roots[currentRootIndex];
    }

    /** @dev Precalculated "Poseidon" hashes, when all leaves are "0x0". */
    function zeros(uint256 level) public pure returns (bytes32) {
        if (level == 0x00)
            return
                bytes32(
                    0x2098f5fb9e239eab3ceac3f27b81e481dc3124d55ffed523a839ee8446b64864
                );
        if (level == 0x01)
            return
                bytes32(
                    0x1069673dcdb12263df301a6ff584a7ec261a44cb9dc68df067a4774460b1f1e1
                );
        if (level == 0x02)
            return
                bytes32(
                    0x18f43331537ee2af2e3d758d50f72106467c6eea50371dd528d57eb2b856d238
                );
        if (level == 0x03)
            return
                bytes32(
                    0x07f9d837cb17b0d36320ffe93ba52345f1b728571a568265caac97559dbc952a
                );
        if (level == 0x04)
            return
                bytes32(
                    0x2b94cf5e8746b3f5c9631f4c5df32907a699c58c94b2ad4d7b5cec1639183f55
                );
        if (level == 0x05)
            return
                bytes32(
                    0x2dee93c5a666459646ea7d22cca9e1bcfed71e6951b953611d11dda32ea09d78
                );
        if (level == 0x06)
            return
                bytes32(
                    0x078295e5a22b84e982cf601eb639597b8b0515a88cb5ac7fa8a4aabe3c87349d
                );
        if (level == 0x07)
            return
                bytes32(
                    0x2fa5e5f18f6027a6501bec864564472a616b2e274a41211a444cbe3a99f3cc61
                );
        if (level == 0x08)
            return
                bytes32(
                    0x0e884376d0d8fd21ecb780389e941f66e45e7acce3e228ab3e2156a614fcd747
                );
        if (level == 0x09)
            return
                bytes32(
                    0x1b7201da72494f1e28717ad1a52eb469f95892f957713533de6175e5da190af2
                );
        if (level == 0x0a)
            return
                bytes32(
                    0x1f8d8822725e36385200c0b201249819a6e6e1e4650808b5bebc6bface7d7636
                );
        if (level == 0x0b)
            return
                bytes32(
                    0x2c5d82f66c914bafb9701589ba8cfcfb6162b0a12acf88a8d0879a0471b5f85a
                );
        if (level == 0x0c)
            return
                bytes32(
                    0x14c54148a0940bb820957f5adf3fa1134ef5c4aaa113f4646458f270e0bfbfd0
                );
        if (level == 0x0d)
            return
                bytes32(
                    0x190d33b12f986f961e10c0ee44d8b9af11be25588cad89d416118e4bf4ebe80c
                );
        if (level == 0x0e)
            return
                bytes32(
                    0x22f98aa9ce704152ac17354914ad73ed1167ae6596af510aa5b3649325e06c92
                );
        if (level == 0x0f)
            return
                bytes32(
                    0x2a7c7c9b6ce5880b9f6f228d72bf6a575a526f29c66ecceef8b753d38bba7323
                );
        if (level == 0x10)
            return
                bytes32(
                    0x2e8186e558698ec1c67af9c14d463ffc470043c9c2988b954d75dd643f36b992
                );
        if (level == 0x11)
            return
                bytes32(
                    0x0f57c5571e9a4eab49e2c8cf050dae948aef6ead647392273546249d1c1ff10f
                );
        if (level == 0x12)
            return
                bytes32(
                    0x1830ee67b5fb554ad5f63d4388800e1cfe78e310697d46e43c9ce36134f72cca
                );
        if (level == 0x13)
            return
                bytes32(
                    0x2134e76ac5d21aab186c2be1dd8f84ee880a1e46eaf712f9d371b6df22191f3e
                );
        if (level == 0x14)
            return
                bytes32(
                    0x19df90ec844ebc4ffeebd866f33859b0c051d8c958ee3aa88f8f8df3db91a5b1
                );
        if (level == 0x15)
            return
                bytes32(
                    0x18cca2a66b5c0787981e69aefd84852d74af0e93ef4912b4648c05f722efe52b
                );
        if (level == 0x16)
            return
                bytes32(
                    0x2388909415230d1b4d1304d2d54f473a628338f2efad83fadf05644549d2538d
                );
        if (level == 0x17)
            return
                bytes32(
                    0x27171fb4a97b6cc0e9e8f543b5294de866a2af2c9c8d0b1d96e673e4529ed540
                );
        if (level == 0x18)
            return
                bytes32(
                    0x2ff6650540f629fd5711a0bc74fc0d28dcb230b9392583e5f8d59696dde6ae21
                );
        if (level == 0x19)
            return
                bytes32(
                    0x120c58f143d491e95902f7f5277778a2e0ad5168f6add75669932630ce611518
                );
        if (level == 0x1a)
            return
                bytes32(
                    0x1f21feb70d3f21b07bf853d5e5db03071ec495a0a565a21da2d665d279483795
                );
        if (level == 0x1b)
            return
                bytes32(
                    0x24be905fa71335e14c638cc0f66a8623a826e768068a9e968bb1a1dde18a72d2
                );
        if (level == 0x1c)
            return
                bytes32(
                    0x0f8666b62ed17491c50ceadead57d4cd597ef3821d65c328744c74e553dac26d
                );
        if (level == 0x1d)
            return
                bytes32(
                    0x0918d46bf52d98b034413f4a1a1c41594e7a7a3f6ae08cb43d1a2a230e1959ef
                );
        if (level == 0x1e)
            return
                bytes32(
                    0x1bbeb01b4c479ecde76917645e404dfa2e26f90d0afc5a65128513ad375c5ff2
                );
        if (level == 0x1f)
            return
                bytes32(
                    0x2f68a1c58e257e42a17a6c61dff5551ed560b9922ab119d5ac8e184c9734ead9
                );
        else revert("Index out of bounds");
    }
}
