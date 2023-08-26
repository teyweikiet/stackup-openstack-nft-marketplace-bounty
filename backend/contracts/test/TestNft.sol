// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNft is ERC721 {
    uint public tokenCounter;

    constructor() ERC721("TestNft", "TEST") {
        tokenCounter = 0;
    }

    function mint() public returns (uint) {
        _safeMint(msg.sender, tokenCounter);
        return tokenCounter++;
    }
}
