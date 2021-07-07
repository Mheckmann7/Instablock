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
            console.log(result)
        })
    })
})