// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintTokenContract.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract SaleTokenContract {
    MintTokenContract public mintTokenContract;

    // constructor
    constructor(address _mintAnimalTokenAddress) {
        mintTokenContract = MintTokenContract(_mintAnimalTokenAddress);
    }

    // structs
    struct TokenData {
        uint256 tokenId;
        uint256 tokenType;
        uint256 tokenPrice;
    }
    // mappings
    mapping(uint256 => uint256) public tokenPrices;
    // arrays
    uint256[] public onSaleTokenArray;

    function setForSaleToken(uint256 _tokenId, uint256 _price) public {
        address tokenOwner = mintTokenContract.ownerOf(_tokenId);

        require(tokenOwner == msg.sender, "Caller is not token owner");
        require(_price > 0, "Price must be greater than 0");
        require(tokenPrices[_tokenId] == 0, "Token is already for sale");
        require(
            mintTokenContract.isApprovedForAll(tokenOwner, address(this)),
            "Token owner did not approve token"
        );

        tokenPrices[_tokenId] = _price;
        onSaleTokenArray.push(_tokenId);
    }

    function purchaseToken(uint256 _tokenId) public payable {
        uint256 price = tokenPrices[_tokenId];
        address tokenOwner = mintTokenContract.ownerOf(_tokenId);

        require(price > 0, "Token is not for sale");
        require(price <= msg.value, "Insufficient price");
        require(tokenOwner != msg.sender, "You cannot purchase your own token");
        tokenPrices[_tokenId] = 0;

        payable(tokenOwner).transfer(msg.value);
        mintTokenContract.safeTransferFrom(tokenOwner, msg.sender, _tokenId);

        for (uint256 i = 0; i < onSaleTokenArray.length; i++) {
            if (tokenPrices[onSaleTokenArray[i]] == 0) {
                removeItemInArray(onSaleTokenArray, i);
            }
        }
    }

    function getOnSaleTokens() public view returns (TokenData[] memory) {
        uint256 onSaleTokenArrayLength = getOnSaleTokenArrayLength();

        TokenData[] memory onSaleTokenDataArray = new TokenData[](
            onSaleTokenArrayLength
        );

        for (uint256 i = 0; i < onSaleTokenArrayLength; i++) {
            uint256 tokenId = onSaleTokenArray[i];
            uint256 tokenType = mintTokenContract.getTokenType(tokenId);
            uint256 tokenPrice = tokenPrices[tokenId];
            onSaleTokenDataArray[i] = TokenData(tokenId, tokenType, tokenPrice);
        }

        return onSaleTokenDataArray;
    }

    function getOnSaleTokenArrayLength() public view returns (uint256) {
        return onSaleTokenArray.length;
    }

    function getTokenPrice(uint256 _tokenId) public view returns (uint256) {
        return tokenPrices[_tokenId];
    }

    // Helper functions
    function removeItemInArray(uint256[] storage _array, uint256 _index)
        private
    {
        _array[_index] = _array[_array.length - 1];
        _array.pop();
    }
}
