import React, { FC, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Main from "./routes/main";
import MySample from "./routes/my-sample";
import SaleSample from "./routes/sale-sample";

const App: FC = () => {
  const [account, setAccount] = React.useState<string>("");

  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        setAccount(accounts[0]);
      } else {
        alert("Install MetaMask to use this app");
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getAccount();
  }, [account]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main account={account} />} />
          <Route path="sale-sample" element={<SaleSample account={account} />} />
          <Route path="my-sample" element={<MySample account={account} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};


export default App;
