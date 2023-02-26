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
    describe("Self Destruct Unit Tests", function () {
        let owner,
            user1,
            user2,
            user3,
            SelfDestructEtherGame,
            SelfDestructAttack
        beforeEach(async () => {
            ;[owner, user1, user2] = await ethers.getSigners()
            SelfDestructEtherGame = await deployContracts(
                "SelfDestructEtherGame"
            )
            SelfDestructAttack = await deployContracts("SelfDestructAttack", [
                SelfDestructEtherGame.address,
            ])
        })

        describe("Attack ", function () {
            it("Attack correctly", async () => {
                await SelfDestructEtherGame.connect(user1).deposit({
                    value: parseEther("1"),
                })
                await SelfDestructEtherGame.connect(user2).deposit({
                    value: parseEther("1"),
                })
                await SelfDestructAttack.attack({
                    value: parseEther("5"),
                })
                expect(
                    await getBalance(SelfDestructEtherGame.address)
                ).to.equal(parseEther("7"))
            })
        })
    })
}
