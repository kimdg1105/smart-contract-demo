import { Grid } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { IMySampleCard } from "../components/MySampleCard";
import SaleSampleCard from "../components/SaleSampleCard";
import { useWeb3Auth } from "../services/web3auth";

interface SaleSampleProps {
    account: string;
}


const SaleSample: FC<SaleSampleProps> = ({ account }) => {
    const { getOnSaleTokens } = useWeb3Auth();
    const [saleSampleCardArray, setSaleSampleCardArray] = useState<IMySampleCard[]>();

    const getOnSaleSampleTokens = async () => {
        try {
            const tempOnSaleArray: IMySampleCard[] = [];
            const response = await getOnSaleTokens();
            response.map((v: IMySampleCard) => {
                return tempOnSaleArray.push({ tokenId: v.tokenId, tokenType: v.tokenType, tokenPrice: v.tokenPrice });
            });
            setSaleSampleCardArray(tempOnSaleArray);
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getOnSaleSampleTokens();
    });

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