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
    describe("Randomness Unit Tests", function () {
        let owner, user1, RandomnessAttack, RandomnessGuess
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            RandomnessGuess = await deployContracts("RandomnessGuess", [], {
                value: parseEther("1"),
            })
            RandomnessAttack = await deployContracts("RandomnessAttack")
        })

        describe("Attack random", function () {
            it("attack correctly", async () => {
                await RandomnessAttack.attack(RandomnessGuess.address)

                expect(await getBalance(RandomnessAttack.address)).to.equal(
                    parseEther("1")
                )
                expect(await getBalance(RandomnessGuess.address)).to.equal(0)
            })
        })
    })
}
