const SaleTokenContract = artifacts.require("SaleTokenContract");
const MintTokenContract = artifacts.require("MintTokenContract");

module.exports = function (deployer) {
    deployer.deploy(SaleTokenContract, MintTokenContract.address);
};
