const { assert, expect } = require("chai")
const { parse } = require("dotenv")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { deployContracts } = require("../utils/utils")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("Overflow Unit Tests", function () {
        let owner, user1, OverflowToken
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            OverflowToken = await deployContracts("OverflowToken", [100])
        })

        describe("Attack Overflow", function () {
            it("attack correctly", async () => {
                await OverflowToken.transfer(user1.address, 1000)

                expect(await OverflowToken.balanceOf(user1.address)).to.equal(
                    1000
                )
                expect(
                    (await OverflowToken.balanceOf(owner.address)) >
                        parseEther("100000000")
                ).to.equal(true)
            })
        })
    })
}
