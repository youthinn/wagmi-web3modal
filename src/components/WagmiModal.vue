<template>
  <div class="user">
    <p>User ID: {{ userId }}</p>
    <p>User Balance: {{ balance }}</p>
    <p>Current Network: {{ networkId }}</p>
    <p>Tx Hash: {{ txHash }}</p>
  </div>
  <hr />
  <hr />
  <hr />
  <div>
    <button v-for="item in wagmiConfig.connectors" @click="wallet(item)">
      {{ item.name }}
    </button>
  </div>
  <hr />
  <div>
    <button @click="getBalanceBth">Get Balance</button>
    <button @click="switchNetworkBth">Switch Network</button>
    <button @click="sendTransactionClick">Send Transaction</button>
  </div>
  <div><button @click="modal">web3modal</button></div>
  <hr />
  <div><button @click="dis">disconnect</button></div>
</template>

<script setup>
import { ref } from "vue";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { parseEther } from "viem";
import {
  configureChains,
  createConfig,
  connect,
  fetchBalance,
  getAccount,
  disconnect,
  getNetwork,
  switchNetwork,
  prepareSendTransaction,
  sendTransaction,
} from "@wagmi/core";
import {
  arbitrum,
  mainnet,
  polygon,
  arbitrumGoerli,
  goerli,
} from "@wagmi/core/chains";

import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { infuraProvider } from "@wagmi/core/providers/infura";

const chains = [arbitrum, mainnet, polygon, arbitrumGoerli, goerli];

const projectId = "624944ddf69f52071b35b4c4aa7f602f";
const alchemyId = "PtFrLzZBPY8AFYyGGxPNRXF_Tdcpeshh";
const infuraId = "ac0a86e0154e4d7a83283ad1b14de881";

const { publicClient } = configureChains(chains, [
  alchemyProvider({ apiKey: alchemyId }),
  w3mProvider({ projectId }),
]);

const userId = ref(null);
const balance = ref(null);
const networkId = ref(null);
const txHash = ref(null);
const changeChainId = 421613;
const toUserId = "0xb93f43B96F05C63700E3D3Fa23D5Dff0ce18F9df";

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "owlto",
        jsonRpcUrl:
          "https://eth-mainnet.alchemyapi.io/v2/oKMNBGBp_hvmPNKm1uNcDbqb32FxOGYP",
      },
    }),
    ...w3mConnectors({ projectId, version: 1, chains }),
  ],
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);

const wallet = async (item) => {
  const result = await connect({
    connector: item,
  });
  const account = getAccount();
  console.log("wallet account", account);
  userId.value = await account.address;
};

const getBalanceBth = async () => {
  const balanceNum = await fetchBalance({
    address: userId.value,
    chainId: changeChainId,
  });
  balance.value = balanceNum.formatted;
  console.log(balance);
};

const switchNetworkBth = async () => {
  const getNetworkId = await getNetwork();
  networkId.value = getNetworkId.chain.id;
  console.log("getNetworkId", getNetworkId);
  if (getNetworkId.chain.id !== getNetworkId) {
    const network = await switchNetwork({
      chainId: changeChainId,
    });
    networkId.value = network.id;
    console.log("newtork", network);
  }
};

const sendTransactionClick = async () => {
  const request = await prepareSendTransaction({
    account: userId.value,
    to: toUserId,
    value: parseEther("0.00141013"),
    chainId: networkId.value,
  });
  console.log("sendTransaction request", request);
  const { hash } = await sendTransaction(request);
  txHash.value = hash;
  console.log("hash", hash);
};

const modal = async () => {
  const res = await web3modal.openModal();
  console.log(res);
  const account = getAccount();
  console.log("web3modal account", account);
};

const dis = async () => {
  await disconnect();
  const account = getAccount();
  console.log("disconnect account", account);
};
</script>

<style scoped>
.user {
  color: royalblue;
}
div {
  margin-top: 40px;
}
div button {
  margin: 0 20px;
}
</style>
