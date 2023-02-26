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
    describe("SelectorClash Unit Tests", function () {
        let owner, user1, SelectorClash
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            SelectorClash = await deployContracts("SelectorClash")
        })

        describe("Attack", function () {
            it("attack correctly", async () => {
                await expect(
                    SelectorClash.putCurEpochConPubKeyBytes("0x")
                ).to.be.revertedWith("Not Owner")

                await SelectorClash.executeCrossChainTx(
                    "0x6631313231333138303933",
                    "0x",
                    "0x",
                    0
                )

                let res = await SelectorClash.solved()
                assert(res)
            })
        })
    })
}
