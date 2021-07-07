// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;

contract Instablock {
    string public name = "Instablock";

    //Store posts
    uint256 public postCount = 0;
    mapping(uint256 => Post) public posts;

    struct Post {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    event PostCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    //Create posts
    function uploadPost(string memory _postHash, string memory _description)
        public
    {
        // increment post id
        postCount++;
        //add post to contract
        posts[1] = Post(postCount, _postHash, _description, 0, msg.sender);
        // trigger an event
        emit PostCreated(postCount, _postHash, _description, 0, msg.sender);
    }
    //Tip posts
}
