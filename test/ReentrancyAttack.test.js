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
    describe("Reentrancy Unit Tests", function () {
        let owner, user1
        beforeEach(async () => {
            ;[owner, user1] = await ethers.getSigners()
        })

        describe("Attack ReentrancyBank", function () {
            let ReentrancyBank, ReentrancyAttack
            beforeEach(async () => {
                ReentrancyBank = await deployContracts("ReentrancyBank")
                ReentrancyAttack = await deployContracts("ReentrancyAttack", [
                    ReentrancyBank.address,
                ])
            })

            it("Attack correctly", async () => {
                await ReentrancyBank.connect(user1).deposit({
                    value: parseEther("20"),
                })
                expect(await getBalance(ReentrancyBank.address)).to.equal(
                    parseEther("20")
                )
                await ReentrancyAttack.attack({ value: parseEther("1") })
                expect(await getBalance(ReentrancyBank.address)).to.equal(0)
                expect(await getBalance(ReentrancyAttack.address)).to.equal(
                    parseEther("21")
                )
            })
        })

        describe("Attack ReentrancyGoodBank", function () {
            let ReentrancyAttack, ReentrancyGoodBank
            beforeEach(async () => {
                ReentrancyGoodBank = await deployContracts("ReentrancyGoodBank")
                ReentrancyAttack = await deployContracts("ReentrancyAttack", [
                    ReentrancyGoodBank.address,
                ])
            })

            it("Attack fail", async () => {
                await ReentrancyGoodBank.connect(user1).deposit({
                    value: parseEther("20"),
                })

                await expect(
                    ReentrancyAttack.attack({ value: parseEther("1") })
                ).to.be.revertedWith("Failed to send Ether")
            })
        })

        describe("Attack ReentrancyProtectedBank", function () {
            let ReentrancyProtectedBank, ReentrancyAttack
            beforeEach(async () => {
                ReentrancyProtectedBank = await deployContracts(
                    "ReentrancyProtectedBank"
                )
                ReentrancyAttack = await deployContracts("ReentrancyAttack", [
                    ReentrancyProtectedBank.address,
                ])
            })

            it("Attack fail", async () => {
                await ReentrancyProtectedBank.connect(user1).deposit({
                    value: parseEther("20"),
                })

                await expect(
                    ReentrancyAttack.attack({ value: parseEther("1") })
                ).to.be.revertedWith("Failed to send Ether")
            })
        })
    })
}
