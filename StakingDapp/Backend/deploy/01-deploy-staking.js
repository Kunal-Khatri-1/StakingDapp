const { network } = require("hardhat");
const { ethers } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const rewardToken = await ethers.getContract("RewardToken");

  const args = [rewardToken.address, rewardToken.address];

  log("----------------------------");
  log("Deploying Staking.sol...");
  const Staking = await deploy("Staking", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(Staking.address, args);
  }
};

module.exports.tags = ["all", "Staking"];
