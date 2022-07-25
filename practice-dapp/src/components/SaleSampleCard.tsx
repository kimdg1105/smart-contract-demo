import { Box, Button, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { mintSampleTokenContract, saleSampleTokenContract, web3 } from "../contracts";
import SampleCard from "./SampleCard";

interface SaleSampleCardProps {
    tokenType: string;
    tokenPrice: string;
    tokenId: string;
    account: string;
    getOnSaleSampleTokens: () => Promise<void>;
}

const SaleSampleCard: FC<SaleSampleCardProps> = ({ tokenType, tokenPrice, tokenId, account, getOnSaleSampleTokens }) => {
    const [isBuyable, setIsBuyable] = useState<boolean>(false);

    const getSampleTokenOwner = async () => {
        try {
            const response = await mintSampleTokenContract.methods
                .ownerOf(tokenId)
                .call();

            setIsBuyable(response.toLocaleLowerCase() === account.toLocaleLowerCase());
        } catch (error) {
            console.log(error);
        }
    }

    const onClickBuy = async () => {
        try {
            if (!account) return;

            const response = await saleSampleTokenContract.methods
                .purchaseToken(tokenId)
                .send({ from: account, value: tokenPrice });
            if (response.status) {
                getOnSaleSampleTokens();
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSampleTokenOwner();
    }, []);

    return (
        <Box textAlign={'center'} w={150}>
            <SampleCard tokenType={tokenType} />
            <Box>
                <Text d="inline-block">
                    {web3.utils.fromWei(tokenPrice)} Ether
                </Text>
                <Button size={"sm"} colorScheme="green" m={4} disabled={isBuyable} onClick={onClickBuy}>
                    Buy!
                </Button>
            </Box>
        </Box>);
};

export default SaleSampleCard;