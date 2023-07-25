import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createConfig,
  createClient,
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon, polygonMumbai } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import AddressChange from "@/Component/ui/AddressChange";

const { chains, provider } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <AddressChange />
          <Component {...pageProps} />;
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
