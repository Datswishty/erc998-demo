const { ethers, waffle } = require("hardhat");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("ethers");
const chai = require("chai");
chai.use(solidity);
chai.use(require("chai-bignumber")());
const { expect } = chai;

describe("Erc998 test", function () {
    let Erc998, erc998, Erc721, erc721, owner, acc1, acc2;

    beforeEach(async () => {
        [owner, acc1, acc2] = await ethers.getSigners();

        Erc998 = await ethers.getContractFactory("ERC998ERC721TopDown");
        erc998 = await Erc998.deploy();
        await erc998.deployed();

        Erc721 = await ethers.getContractFactory("MyToken");
        erc721 = await Erc721.deploy();
        await erc721.deployed();

        // Minting test erc721
        erc721.connect(owner).safeMint(owner.address);
        erc721.connect(owner).safeMint(owner.address);
        erc721.connect(owner).safeMint(owner.address);

        erc721.setApprovalForAll(erc998.address, true);
    });
    describe("Test 998 functional", async () => {
        it("Should attach 2 erc721 to erc998 , transfer it to another address , and deattach", async () => {
            // attaching 2 erc721 to erc998
            await erc998.connect(owner).mint(owner.address);
            await erc998
                .connect(owner)
                .getChild(owner.address, 1, erc721.address, 0);
            await erc998
                .connect(owner)
                .getChild(owner.address, 1, erc721.address, 1);

            expect(await erc721.balanceOf(owner.address)).to.be.deep.equal(1);
            // transfering erc998 token
            await erc721.connect(owner).setApprovalForAll(erc998.address, true);
            await erc998
                .connect(owner)
                .transferFrom(owner.address, acc1.address, 1);

            expect(await erc998.balanceOf(acc1.address)).to.be.deep.equal(1);
            // deattach erc721 from erc998

            await erc998
                .connect(acc1)
                [`safeTransferChild(uint256,address,address,uint256)`](
                    1,
                    acc1.address,
                    erc721.address,
                    0
                ); // function overloading

            expect(await erc721.balanceOf(acc1.address)).to.be.deep.equal(1);
        });
    });
});
