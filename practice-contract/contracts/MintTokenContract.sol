// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SaleTokenContract.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MintTokenContract is ERC721Enumerable {
    SaleTokenContract public saleTokenContract;

    // constructor
    constructor() ERC721("SampleToken", "ST") {}

    // unique tokenId -> tokenTypes
    mapping(uint256 => uint256) public tokenTypes;

    struct TokenData {
        uint256 tokenId;
        uint256 tokenType;
        uint256 tokenPrice;
    }

    // functions
    function mintToken() public returns (uint256) {
        // unique token id
        uint256 tokenId = totalSupply() + 1;

        // generate Random tokenType(1~5)
        uint256 tokenType = (uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))
        ) % 5) + 1;
        tokenTypes[tokenId] = tokenType;

        _mint(msg.sender, tokenId);
        return tokenId;
    }

    function getTokens(address _tokenOwner)
        public
        view
        returns (TokenData[] memory)
    {
        uint256 balanceLength = balanceOf(_tokenOwner);
        require(balanceLength > 0, "No tokens");
        TokenData[] memory tokenDataArray = new TokenData[](balanceLength);

        for (uint256 i = 0; i < balanceLength; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(_tokenOwner, i);
            uint256 tokenType = tokenTypes[tokenId];
            uint256 tokenPrice = saleTokenContract.getTokenPrice(tokenId);
            tokenDataArray[i] = TokenData(tokenId, tokenType, tokenPrice);
        }

        return tokenDataArray;
    }

    function setSaleTokenContract(address _saleTokenContractAddress) public {
        saleTokenContract = SaleTokenContract(_saleTokenContractAddress);
    }

    function getTokenType(uint256 _tokenId) public view returns (uint256) {
        return tokenTypes[_tokenId];
    }
}
