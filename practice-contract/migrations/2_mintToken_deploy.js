const MintTokenContract = artifacts.require("MintTokenContract");

module.exports = function (deployer) {
    deployer.deploy(MintTokenContract);
};
