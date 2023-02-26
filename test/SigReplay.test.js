const { assert, expect } = require("chai")
const { parse } = require("dotenv")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { deployContracts, getSignature } = require("../utils/utils")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("SigReplay Unit Tests", function () {
        let owner, user1, user2, user3, SigReplay
        beforeEach(async () => {
            ;[owner, user1, user2, user3] = await ethers.getSigners()
            SigReplay = await deployContracts("SigReplay")
        })

        describe("Attack", function () {
            it("mint success", async () => {
                const hash = await SigReplay.getMessageHash(
                    owner.address,
                    "1000"
                )
                const sig = await getSignature([owner], hash)

                await SigReplay.badMint(owner.address, 1000, sig)
                let balance = await SigReplay.balanceOf(owner.address)
                expect(balance).to.equal(1000)

                await SigReplay.badMint(owner.address, 1000, sig)
                balance = await SigReplay.balanceOf(owner.address)
                expect(balance).to.equal(2000)
            })
        })
    })
}
