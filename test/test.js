const { assert } = require('chai')

const Instablock = artifacts.require('./Instablock.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Instablock', ([deployer, author, tipper]) => {
    let instablock

    before(async () => {
        instablock = await Instablock.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await instablock.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async () => {
            const name = await instablock.name()
            assert.equal(name, 'Instablock')
        })
    })

    describe('posts', async () => {
        let result, postCount
        const hash = 'abc123'

        before(async () => {
            result = await instablock.uploadPost(hash, 'Post description', { from: author });
            postCount = await instablock.postCount()
        })

        it('creates posts', async () => {
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Post description', 'description is correct')
            assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')
            // Failure: must have hash
            await instablock.uploadPost('', 'Post description', { from: author }).should.be.rejected;
            // Failure: must have description 
            await instablock.uploadPost('Post hash', '', { from: author }).should.be.rejected;
        })
        it('lists posts', async () => {
            const post = await instablock.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.hash, hash, 'Hash is correct')
            assert.equal(post.description, 'Post description', 'description is correct')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })
    })
})