import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/web3auth";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "../config/chainConfig";
import { WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";
import { getWalletProvider, IWalletProvider } from "./walletProvider";

export interface IWeb3AuthContext {
    web3Auth: Web3Auth | null;
    provider: IWalletProvider | null;
    isLoading: boolean;
    user: unknown;
    chain: string;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
    signMessage: () => Promise<any>;
    getAccounts: () => Promise<any>;
    getBalance: () => Promise<any>;
    signTransaction: () => Promise<void>;
    signAndSendTransaction: () => Promise<void>;

    // dapp methods
    mintToken: (account: string) => Promise<any>;
    balanceOf: (account: string) => Promise<any>;
    tokenOfOwnerByIndex: (balanceLength: string) => Promise<any>;
    tokenType: (tokenId: string) => Promise<any>;
    getTokens: (account: string) => Promise<any>;
    getOnSaleTokens: () => Promise<any>;
    getIsApproved: (account: string) => Promise<any>;
    setApprovalForAll: (account: string, saleStatus: boolean) => Promise<any>;
    setForSaleToken: (account: string, tokenId: string, tokenPrice: string) => Promise<any>;
    ownerOf: (tokenId: string) => Promise<any>;
    userOf: (tokenId: string) => Promise<any>;
    purchaseToken: (account: string, tokenId: string, tokenPrice: string) => Promise<any>;
    setTokenUser: (account: string, tokenId: string, expires: number) => Promise<any>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
    web3Auth: null,
    provider: null,
    isLoading: false,
    user: null,
    chain: "",
    login: async () => { },
    logout: async () => { },
    getUserInfo: async () => { },
    signMessage: async () => { },
    getAccounts: async () => { },
    getBalance: async () => { },
    signTransaction: async () => { },
    signAndSendTransaction: async () => { },
    // dapp-specific
    mintToken: async () => { },
    balanceOf: async (account: string) => { },
    tokenOfOwnerByIndex: async () => { },
    tokenType: async () => { },
    getTokens: async () => { },
    getOnSaleTokens: async () => { },
    getIsApproved: async () => { },
    setApprovalForAll: async () => { },
    setForSaleToken: async () => { },
    ownerOf: async () => { },
    userOf: async () => { },
    purchaseToken: async () => { },
    setTokenUser: async () => { }
});

export function useWeb3Auth(): IWeb3AuthContext {
    return useContext(Web3AuthContext);
}

interface IWeb3AuthState {
    web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
    chain: CHAIN_CONFIG_TYPE;
}
interface IWeb3AuthProps {
    children?: ReactNode;
    web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
    chain: CHAIN_CONFIG_TYPE;
}

export const Web3AuthProvider: FunctionComponent<IWeb3AuthState> = ({ children, web3AuthNetwork, chain }: IWeb3AuthProps) => {
    const [web3Auth, setWeb3Auth] = useState<Web3Auth | null>(null);
    const [provider, setProvider] = useState<IWalletProvider | null>(null);
    const [user, setUser] = useState<unknown | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const setWalletProvider = useCallback(
        (web3authProvider: SafeEventEmitterProvider) => {
            const walletProvider = getWalletProvider(chain, web3authProvider, uiConsole);
            setProvider(walletProvider);
        },
        [chain]
    );

    useEffect(() => {
        const subscribeAuthEvents = (web3auth: Web3Auth) => {
            // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
                console.log("Yeah!, you are successfully logged in", data);
                setUser(data);
                setWalletProvider(web3auth.provider!);
            });

            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
                console.log("connecting");
            });

            web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
                console.log("disconnected");
                setUser(null);
            });

            web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
                console.error("some error or user has cancelled login request", error);
            });
        };

        const currentChainConfig = CHAIN_CONFIG[chain];

        async function init() {
            try {
                setIsLoading(true);
                const clientId = "BCcnHErKqeaC_n6Qb1D-jqyyIXWiu-akAfdwGaOlL7ntnmoD2Pn10R0YozdHo4cwH4_SLd-1yv6TgCyc0PV3y3s";
                const web3AuthInstance = new Web3Auth({
                    chainConfig: currentChainConfig,
                    // get your client id from https://dashboard.web3auth.io
                    clientId,
                });
                const adapter = new OpenloginAdapter({ adapterSettings: { network: web3AuthNetwork, clientId } });
                web3AuthInstance.configureAdapter(adapter);
                subscribeAuthEvents(web3AuthInstance);
                setWeb3Auth(web3AuthInstance);
                await web3AuthInstance.initModal();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        init();
    }, [chain, web3AuthNetwork, setWalletProvider]);

    const login = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            uiConsole("web3auth not initialized yet");
            return;
        }
        const localProvider = await web3Auth.connect();
        setWalletProvider(localProvider!);
    };

    const logout = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            uiConsole("web3auth not initialized yet");
            return;
        }
        await web3Auth.logout();
        setProvider(null);
    };

    const getUserInfo = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            uiConsole("web3auth not initialized yet");
            return;
        }
        const user = await web3Auth.getUserInfo();
        uiConsole(user);
    };

    const getAccounts = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        const response = await provider.getAccounts();
        return response;
    };

    const getBalance = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        await provider.getBalance();
    };

    const signMessage = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        await provider.signMessage();
    };

    const signTransaction = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        await provider.signTransaction();
    };

    const signAndSendTransaction = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        await provider.signAndSendTransaction();
    };

    // dapp-specific
    const mintToken = async (account: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.mintToken(account);
    };

    const balanceOf = async (account: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.balanceOf(account);
    };

    const tokenOfOwnerByIndex = async (balanceLength: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.tokenOfOwnerByIndex(balanceLength);
    };

    const tokenType = async (tokenId: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.tokenType(tokenId);
    };

    const getTokens = async (account: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.getTokens(account);
    };

    const getOnSaleTokens = async () => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.getOnSaleTokens();
    };

    const getIsApproved = async (account: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.getIsApproved(account);
    };

    const setApprovalForAll = async (account: string, saleStatus: boolean) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.setApprovalForAll(account, saleStatus);
    };

    const setForSaleToken = async (account: string, tokenId: string, tokenPrice: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.setForSaleToken(account, tokenId, tokenPrice);
    };

    const ownerOf = async (tokenId: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.ownerOf(tokenId);
    };

    const userOf = async (tokenId: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.userOf(tokenId);
    };

    const purchaseToken = async (account: string, tokenId: string, tokenPrice: string) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.purchaseToken(account, tokenId, tokenPrice);
    };

    const setTokenUser = async (account: string, tokenId: string, expires: number) => {
        if (!provider) {
            console.log("provider not initialized yet");
            uiConsole("provider not initialized yet");
            return;
        }
        return await provider.setUser(account, tokenId, expires);
    };


    const uiConsole = (...args: unknown[]): void => {
        const el = document.querySelector("#console>p");
        if (el) {
            el.innerHTML = JSON.stringify(args || {}, null, 2);
        }
    };

    const contextProvider = {
        web3Auth,
        chain,
        provider,
        user,
        isLoading,
        login,
        logout,
        getUserInfo,
        getAccounts,
        getBalance,
        signMessage,
        signTransaction,
        signAndSendTransaction,
        balanceOf,
        tokenOfOwnerByIndex,
        tokenType,
        mintToken,
        getTokens,
        getOnSaleTokens,
        getIsApproved,
        setApprovalForAll,
        setForSaleToken,
        ownerOf,
        userOf,
        purchaseToken,
        setTokenUser

    };
    return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
