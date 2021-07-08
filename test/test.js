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
        it('allows users to tip posts', async () => {
            //Track the author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await instablock.tipPostOwner(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
            
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Post description', 'description is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            //check author receives funds
            let newAuthorBalance
            newAuthorBalance = await web3.eth.getBalance(author)
            newAuthorBalance = new web3.utils.BN(newAuthorBalance)

            let tipPostOwner
            tipPostOwner = web3.utils.toWei('1', 'Ether')
            tipPostOwner = new web3.utils.BN(tipPostOwner)

            const expectedBalance = oldAuthorBalance.add(tipPostOwner)

            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
            // Tries to tip an image that does not exist 
            await instablock.tipPostOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
        })
    })
})