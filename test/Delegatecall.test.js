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
    describe("Delegatecall Unit Tests", function () {
        let owner, user1, DelegatecallAttack, DelegatecallHackMe
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()

            const DelegatecallLib = await deployContracts("DelegatecallLib")
            DelegatecallHackMe = await deployContracts("DelegatecallHackMe", [
                DelegatecallLib.address,
            ])
            DelegatecallAttack = await deployContracts("DelegatecallAttack", [
                DelegatecallHackMe.address,
            ])
        })

        describe("Attack", function () {
            it("attack correctly", async () => {
                expect(await DelegatecallHackMe.owner()).to.equal(owner.address)
                await DelegatecallAttack.connect(user1).attack()
                expect(await DelegatecallHackMe.owner()).to.equal(
                    DelegatecallAttack.address
                )
            })
        })
    })
}
