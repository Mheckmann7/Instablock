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

    event PostTipped(
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
        // make sure hash, desc, and address exist
        require(bytes(_postHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));
        // increment post id
        postCount++;
        //add post to contract
        posts[1] = Post(
            postCount,
            _postHash,
            _description,
            0,
            payable(msg.sender)
        );
        // trigger an event
        emit PostCreated(
            postCount,
            _postHash,
            _description,
            0,
            payable(msg.sender)
        );
    }

    //Tip posts
    function tipPostOwner(uint256 _id) public payable {
        // make sure id is valid
        require(_id > 0 && _id <= postCount);
        // fetch the post and author
        Post memory _post = posts[_id];
        address payable _author = _post.author;
        // pay the author
        payable(_author).transfer(msg.value);
        _post.tipAmount = _post.tipAmount + msg.value;
        //update the post
        posts[_id] = _post;

        emit PostTipped(
            _id,
            _post.hash,
            _post.description,
            _post.tipAmount,
            _author
        );
    }
}
