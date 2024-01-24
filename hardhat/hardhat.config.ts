import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",

    // Note: Optimizer is required or we will get a "stack too deep" error
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
        details: {
          yul: true,
        },
      },
    },
  },

  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA}`,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
};

export default config;
