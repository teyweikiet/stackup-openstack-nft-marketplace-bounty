// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace {
	using SafeMath for uint256;

	struct Listing {
		address seller;
		address buyer;
		uint price;
		address nftAddress;
		uint tokenId;
		uint256 listedAt;
		uint256 soldAt;
	}

	uint public listingCount; // listing counter to keep track of number of listing and used as listing Id
	mapping(uint => Listing) public listings; // listings

	event ItemListed(uint listingId, uint price); // event when new listing is created
	event ItemSold(uint listingId); // event when an item is sold

	// list item for sale
	function listItem(
		uint _price,
		address _nftAddress,
		uint _tokenId
	)
		external
	{
		// get nft contract
		IERC721 nft = IERC721(_nftAddress);

		// check if price is > 0
		require(_price > 0, "Price must be greater than 0");

		// check if seller is the owner
		require(
			nft.ownerOf(_tokenId) == msg.sender,
            "Only owner is allowed to list item"
		);

		// check if seller has given the marketplace approval
		require(
			nft.getApproved(_tokenId) == address(this),
            "No approval to marketplace"
		);

		// get current listingId value and increment the counter
		uint listingId = listingCount++;

		// create & add listing to the map
		listings[listingId].seller = nft.ownerOf(_tokenId);
		listings[listingId].price = _price;
		listings[listingId].nftAddress = _nftAddress;
		listings[listingId].tokenId = _tokenId;
		listings[listingId].listedAt = block.timestamp;

		// emit itemListed event
		emit ItemListed(listingId, _price);
	}

	// buy item
	function buyItem(
		uint _listingId
	) external payable {
		// check if listingId is valid
		require(
			listings[_listingId].price > 0,
			"Listing not found"
		);
		// check if item is still available
		require(
			listings[_listingId].soldAt == 0,
			"Item is already sold"
		);
		// check is the buyer is not the seller
        require(
			msg.sender != listings[_listingId].seller,
			"Seller cannot be buyer"
		);
		// check if the amount pay equals the price
        require(
			msg.value == listings[_listingId].price,
			"Amount paid not equals price"
		);

        // transfer token to buyer
        IERC721(listings[_listingId].nftAddress).safeTransferFrom(listings[_listingId].seller, msg.sender, listings[_listingId].tokenId);
        // transfer fund to seller
        (bool success, ) = payable(listings[_listingId].seller).call{value: msg.value}("");
		require(success, "Transfer failed.");

		// update listing details
        listings[_listingId].buyer = msg.sender;
        listings[_listingId].soldAt = block.timestamp;

		// emit itemSold event
        emit ItemSold(_listingId);
    }
}
