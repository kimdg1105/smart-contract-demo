import { SafeEventEmitterProvider } from "@web3auth/base";
import ethProvider from "./ethProvider";

export interface IWalletProvider {
    getAccounts: () => Promise<any>;
    getBalance: () => Promise<any>;
    signAndSendTransaction: () => Promise<void>;
    signTransaction: () => Promise<void>;
    signMessage: () => Promise<void>;
    get web3(): any;

    // Dapp specific
    balanceOf: (account: string) => Promise<any>;
    tokenOfOwnerByIndex: (balanceLength: string) => Promise<any>;
    tokenType: (tokenId: string) => Promise<any>;
    mintToken: (account: string) => Promise<void>;
    getTokens: (account: string) => Promise<any>;
    getOnSaleTokens: () => Promise<any>;
    getIsApproved: (account: string) => Promise<any>;
    setApprovalForAll: (account: string, saleStatus: boolean) => Promise<any>;
    setForSaleToken: (account: string, tokenId: string, sellPrice: string) => Promise<any>;
    ownerOf: (tokenId: string) => Promise<any>;
    userOf: (tokenId: string) => Promise<any>;
    purchaseToken: (account: string, tokenId: string, tokenPrice: string) => Promise<any>;
    setUser: (account: string, tokenId: string, expires: number) => Promise<any>;
}

export const getWalletProvider = (chain: string, provider: SafeEventEmitterProvider, uiConsole: any): IWalletProvider => {
    return ethProvider(provider, uiConsole);
};
