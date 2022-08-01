const SampleTokenContract = artifacts.require("SampleTokenV1");

module.exports = function (deployer) {
    deployer.deploy(SampleTokenContract);
};
