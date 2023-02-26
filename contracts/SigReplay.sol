// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// 权限管理错误例子
contract SigReplay is ERC20 {
    address public signer;

    constructor() ERC20("SigReplay", "Replay") {
        signer = msg.sender;
    }

    function badMint(address to, uint amount, bytes memory signature) public {
        bytes32 _msgHash = toEthSignedMessageHash(getMessageHash(to, amount));
        require(verify(_msgHash, signature), "Invalid Signer!");
        _mint(to, amount);
    }

    function getMessageHash(
        address to,
        uint256 amount
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(to, amount));
    }

    function toEthSignedMessageHash(
        bytes32 hash
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
            );
    }

    function verify(
        bytes32 _msgHash,
        bytes memory _signature
    ) public view returns (bool) {
        return ECDSA.recover(_msgHash, _signature) == signer;
    }
}
