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
    describe("Dos Unit Tests", function () {
        let owner, user1, user2, user3, DosKingOfEther, DosAttack
        beforeEach(async () => {
            ;[owner, user1, user2, user3] = await ethers.getSigners()
            DosKingOfEther = await deployContracts("DosKingOfEther")
            DosAttack = await deployContracts("DosAttack", [
                DosKingOfEther.address,
            ])
        })

        describe("Attack", function () {
            it("attack correctly", async () => {
                await DosKingOfEther.claimThrone({ value: parseEther("1") })
                let balanceOwner = await getBalance(owner.address)
                await DosKingOfEther.connect(user2).claimThrone({
                    value: parseEther("2"),
                })
                expect(
                    (await getBalance(owner.address)).sub(balanceOwner)
                ).to.equal(parseEther("1"))
                await DosAttack.attack({ value: parseEther("3") })

                await expect(
                    DosKingOfEther.connect(user3).claimThrone({
                        value: parseEther("4"),
                    })
                ).to.be.revertedWith("Failed to send Ether")
            })
        })
    })
}
