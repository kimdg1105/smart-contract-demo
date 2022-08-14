import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { IWalletProvider } from "./walletProvider";
import { sampleTokenAbi, sampleTokenAddress } from "../contracts";

const ethProvider = (provider: SafeEventEmitterProvider, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
    const web3 = new Web3(provider as any);
    const sampleTokenContract = new web3.eth.Contract(
        sampleTokenAbi,
        sampleTokenAddress
    );
    const getAccounts = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            uiConsole("Eth accounts", accounts);
            return accounts;
        } catch (error) {
            console.error("Error", error);
            uiConsole("error", error);
        }
    };

    const getBalance = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            const balance = await web3.eth.getBalance(accounts[0]);
            uiConsole("Eth balance", balance);
        } catch (error) {
            console.error("Error", error);
            uiConsole("error", error);
        }
    };

    const signMessage = async () => {
        try {
            const pubKey = (await provider.request({ method: "eth_accounts" })) as string[];
            const message = "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad";
            (web3.currentProvider as any)?.send(
                {
                    method: "eth_sign",
                    params: [pubKey[0], message],
                    from: pubKey[0],
                },
                (err: Error, result: any) => {
                    if (err) {
                        return uiConsole(err);
                    }
                    uiConsole("Eth sign message => true", result);
                }
            );
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    };

    const signAndSendTransaction = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("pubKey", accounts);
            const txRes = await web3.eth.sendTransaction({ from: accounts[0], to: accounts[0], value: web3.utils.toWei("0.01") });
            uiConsole("txRes", txRes);
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    };

    const signTransaction = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log("pubKey", accounts);
            // only supported with social logins (openlogin adapter)
            const txRes = await web3.eth.signTransaction({ from: accounts[0], to: accounts[0], value: web3.utils.toWei("0.01") });
            uiConsole("txRes", txRes);
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    };

    // ---- Dapp UI ----
    const balanceOf = async (account: string) => {
        try {
            const response = await sampleTokenContract.methods
                .balanceOf(account)
                .call();
            return response;
        }
        catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    };

    const tokenOfOwnerByIndex = async (balanceLength: string) => {
        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            const response = await sampleTokenContract.methods
                .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 1)
                .call();

            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const tokenType = async (tokenId: string) => {
        try {
            const response = await sampleTokenContract.methods
                .tokenTypes(tokenId)
                .call();

            return response;
        }
        catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const mintToken = async (account: string) => {
        try {
            const response = await sampleTokenContract.methods
                .mintToken()
                .send({ from: account });
            uiConsole("response", response);
            return response;
        } catch (error) {
            console.log(error);
            uiConsole("error", error);
        }
    }

    const getTokens = async (account: string) => {
        try {
            const response = await sampleTokenContract.methods
                .getTokens(account)
                .call();
            return response;
        }
        catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const getOnSaleTokens = async () => {
        try {
            const response = await sampleTokenContract.methods
                .getOnSaleTokens()
                .call();
            return response;
        }
        catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }


    const getIsApproved = async (account: string) => {
        try {
            const response = await sampleTokenContract.methods
                .isApprovedForAll(account, sampleTokenAddress)
                .call();
            return response;
        }
        catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const setApprovalForAll = async (account: string, saleStatus: boolean) => {
        try {
            const response = await sampleTokenContract.methods
                .setApprovalForAll(sampleTokenAddress, saleStatus)
                .send({ from: account });
            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const setForSaleToken = async (account: string, tokenId: string, sellPrice: string) => {
        try {
            const response = await sampleTokenContract.methods
                .setForSaleToken(tokenId, web3.utils.toWei(sellPrice, "ether"))
                .send({ from: account });
            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const ownerOf = async (tokenId: string) => {
        try {
            const response = await sampleTokenContract.methods
                .ownerOf(tokenId)
                .call();
            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const userOf = async (tokenId: string) => {
        try {
            const response = await sampleTokenContract.methods
                .userOf(tokenId)
                .call();
            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const purchaseToken = async (account: string, tokenId: string, tokenPrice: string) => {
        try {
            const response = await sampleTokenContract.methods
                .purchaseToken(tokenId)
                .send({ from: account, value: tokenPrice });
            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }

    const setUser = async (account: string, tokenId: string, expires: number) => {
        try {
            const response = await sampleTokenContract.methods
                .setUser(tokenId, account, expires)
                .send({ from: account });
            return response;
        } catch (error) {
            console.log("error", error);
            uiConsole("error", error);
        }
    }


    return {
        getAccounts,
        getBalance,
        signMessage,
        signAndSendTransaction,
        signTransaction,
        balanceOf,
        tokenOfOwnerByIndex,
        tokenType,
        mintToken,
        getTokens,
        getOnSaleTokens,
        getIsApproved,
        setApprovalForAll,
        setForSaleToken,
        web3,
        ownerOf,
        userOf,
        purchaseToken,
        setUser
    };
};

export default ethProvider;
