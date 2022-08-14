import { FC, useState } from "react";
import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Mint from "./routes/mint";
import MySample from "./routes/my-sample";
import SaleSample from "./routes/sale-sample";
import { CHAIN_CONFIG_TYPE } from "./config/chainConfig";
import { WEB3AUTH_NETWORK_TYPE } from "./config/web3AuthNetwork";
import { Web3AuthProvider } from "./services/web3auth";
import Setting from "./components/Setting";
import Main from "./components/Main";

const App: FC = () => {
  const [account, setAccount] = useState<string>("");
  const [web3AuthNetwork, setWeb3AuthNetwork] = useState<WEB3AUTH_NETWORK_TYPE>("testnet");
  const [chain, setChain] = useState<CHAIN_CONFIG_TYPE>("ropsten");

  return (
    <Web3AuthProvider chain={chain} web3AuthNetwork={web3AuthNetwork}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Mint account={account} />} />
            <Route path="sale-sample" element={<SaleSample account={account} />} />
            <Route path="my-sample" element={<MySample account={account} />} />
          </Routes>
          <Setting setNetwork={setWeb3AuthNetwork} setChain={setChain} />
          <Main setAccount={setAccount}></Main>
        </Layout>
      </BrowserRouter>
    </Web3AuthProvider>

  );
};

export default App;
