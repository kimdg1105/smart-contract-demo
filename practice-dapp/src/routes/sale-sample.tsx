import { Grid } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { IMySampleCard } from "../components/MySampleCard";
import SaleSampleCard from "../components/SaleSampleCard";
import { saleSampleTokenContract, mintSampleTokenContract } from "../contracts";

interface SaleSampleProps {
    account: string;
}


const SaleSample: FC<SaleSampleProps> = ({ account }) => {
    const [saleSampleCardArray, setSaleSampleCardArray] = useState<IMySampleCard[]>();

    const getOnSaleSampleTokens = async () => {
        try {
            const tempOnSaleArray: IMySampleCard[] = [];

            const response = await saleSampleTokenContract.methods
                .getOnSaleTokens()
                .call();

            response.map((v: IMySampleCard) => {
                tempOnSaleArray.push({ tokenId: v.tokenId, tokenType: v.tokenType, tokenPrice: v.tokenPrice });
            });
            setSaleSampleCardArray(tempOnSaleArray);
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getOnSaleSampleTokens();
    }, []);

    return (
        <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}>
            {saleSampleCardArray &&
                saleSampleCardArray.map((v, i) => {
                    return <SaleSampleCard
                        key={i}
                        tokenType={v.tokenType}
                        tokenPrice={v.tokenPrice}
                        tokenId={v.tokenId}
                        account={account}
                        getOnSaleSampleTokens={getOnSaleSampleTokens}
                    />;
                })}
        </Grid>
    );;
}

export default SaleSample;