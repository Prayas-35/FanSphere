import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

const { OPBNB_RPC_URL, PRIVATE_KEY, OPBNBSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    opbnb: {
      url: `${OPBNB_RPC_URL}`,
      accounts: [`${PRIVATE_KEY}`],
      chainId: 5611,
    },
  },
  etherscan: {
    apiKey: {
      opbnb: `${OPBNBSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: "opbnb",
        chainId: 5611,
        urls: {
          apiURL: `https://open-platform.nodereal.io/35dbeae6f78946d2b43b90275d8b0753/op-bnb-testnet/contract/`,
          browserURL: "https://testnet.opbnbscan.com/",
        },
      },
    ],
  },
  // sourcify: {
  //   enabled: true,
  // },
  solidity: "0.8.28",
};

export default config;
