// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

interface IERC4907 {
    // Logged when the user of a token assigns a new user or updates expires
    /// @notice Emitted when the `user` of an NFT or the `expires` of the `user` is changed
    /// The zero address for user indicates that there is no user address
    event UpdateUser(
        uint256 indexed tokenId,
        address indexed user,
        uint64 expires
    );

    /// @notice set the user and expires of a NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) external;

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId) external view returns (address);

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId) external view returns (uint256);
}

// Mint
//      .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.
// `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'

contract SampleTokenV1 is ERC721Enumerable, IERC4907 {
    using Counters for Counters.Counter;

    // constructor
    constructor() ERC721("SampleToken", "ST") {}

    // structs
    struct UserInfo {
        address user; // address of user role
        uint64 expires; // unix timestamp, user expires
    }

    struct TokenData {
        uint256 tokenId;
        uint256 tokenType;
        uint256 tokenPrice;
    }

    Counters.Counter private _tokenIdCounter;

    // mappings
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => UserInfo) private _users;
    mapping(uint256 => uint256) public tokenTypes;

    // functions
    function mintToken() public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        // generate random tokenType(1~5)
        uint256 tokenType = (uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))
        ) % 5) + 1;
        tokenTypes[tokenId] = tokenType;
        _mint(msg.sender, tokenId);

        // after contract deployed, msg.sender's token shound approve contract
        // _approve(address(this), tokenId);

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
            uint256 tokenPrice = getTokenPrice(tokenId);
            tokenDataArray[i] = TokenData(tokenId, tokenType, tokenPrice);
        }
        return tokenDataArray;
    }

    function getTokenType(uint256 _tokenId) public view returns (uint256) {
        return tokenTypes[_tokenId];
    }

    // Sale
    //      .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.
    // `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'

    uint256[] private _onSaleTokenArray;

    function setForSaleToken(uint256 _tokenId, uint256 _price) public {
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender, "Caller is not token owner");
        require(_price > 0, "Price must be greater than 0");
        require(tokenPrices[_tokenId] == 0, "Token is already for sale");
        require(
            isApprovedForAll(tokenOwner, address(this)),
            "Token owner did not approve token"
        );

        tokenPrices[_tokenId] = _price;
        _onSaleTokenArray.push(_tokenId);
    }

    function purchaseToken(uint256 _tokenId) public payable {
        uint256 price = tokenPrices[_tokenId];
        address tokenOwner = ownerOf(_tokenId);

        require(price > 0, "Token is not for sale");
        require(price <= msg.value, "Insufficient price");
        require(tokenOwner != msg.sender, "You cannot purchase your own token");
        tokenPrices[_tokenId] = 0;

        payable(tokenOwner).transfer(msg.value);
        this.safeTransferFrom(tokenOwner, msg.sender, _tokenId);

        for (uint256 i = 0; i < _onSaleTokenArray.length; i++) {
            if (tokenPrices[_onSaleTokenArray[i]] == 0) {
                removeItemInArray(_onSaleTokenArray, i);
            }
        }
    }

    function getOnSaleTokens() public view returns (TokenData[] memory) {
        uint256 onSaleTokenArrayLength = getOnSaleTokenArrayLength();

        TokenData[] memory onSaleTokenDataArray = new TokenData[](
            onSaleTokenArrayLength
        );

        for (uint256 i = 0; i < onSaleTokenArrayLength; i++) {
            uint256 tokenId = _onSaleTokenArray[i];
            uint256 tokenType = getTokenType(tokenId);
            uint256 tokenPrice = tokenPrices[tokenId];
            onSaleTokenDataArray[i] = TokenData(tokenId, tokenType, tokenPrice);
        }

        return onSaleTokenDataArray;
    }

    function getOnSaleTokenArrayLength() public view returns (uint256) {
        return _onSaleTokenArray.length;
    }

    function getTokenPrice(uint256 _tokenId) public view returns (uint256) {
        return tokenPrices[_tokenId];
    }

    // Rent
    //      .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.
    // `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'

    /// @notice set the user and expires of a NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public virtual override {
        // For test : delegator can call this function
        // require(
        //     _isApprovedOrOwner(msg.sender, tokenId),
        //     "ERC721: transfer caller is not owner nor approved"
        // );
        require(userOf(tokenId) == address(0), "User already assigned");
        require(expires > block.timestamp, "expires should be in future");
        _beforeTokenTransfer(msg.sender, user, tokenId);
        UserInfo storage info = _users[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);
    }

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId)
        public
        view
        virtual
        override
        returns (address)
    {
        if (uint256(_users[tokenId].expires) >= block.timestamp) {
            return _users[tokenId].user;
        }
        return address(0);
    }

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _users[tokenId].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC4907).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (
            from != to &&
            _users[tokenId].user != address(0) && //user present
            block.timestamp >= _users[tokenId].expires //user expired
        ) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }
    }

    function getBlockTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    //      .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.     .-.
    // `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'   `._.'

    // Helper functions
    function removeItemInArray(uint256[] storage _array, uint256 _index)
        private
    {
        _array[_index] = _array[_array.length - 1];
        _array.pop();
    }
}
