import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createConfig } from '@wagmi/core'
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'



const chains = [arbitrum, mainnet, polygon]
const projectId = "624944ddf69f52071b35b4c4aa7f602f";
const alchemyId = 'oKMNBGBp_hvmPNKm1uNcDbqb32FxOGYP';
const infuraId = "ac0a86e0154e4d7a83283ad1b14de881";

const { publicClient } = configureChains(chains, [
  alchemyProvider({ apiKey: alchemyId }),
  w3mProvider({ projectId })]
)
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)