import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import MySampleCard, { IMySampleCard } from "../components/MySampleCard";
import { useWeb3Auth } from "../services/web3auth";

interface MySampleProps {
    account: string;
}

const MySample: FC<MySampleProps> = ({ account }) => {
    const { balanceOf, setApprovalForAll, getIsApproved, getTokens } = useWeb3Auth();
    const [sampleCardArray, setSampleCardArray] = useState<IMySampleCard[]>();
    const [saleStatus, setSaleStatus] = useState<boolean>(false);

    const getSampleTokens = async () => {
        try {
            const balanceLength = await balanceOf(account);
            if (balanceLength === "0") return;

            const tempSampleCardArray: IMySampleCard[] = [];
            const response = await getTokens(account);
            response.map((v: IMySampleCard) => {
                return tempSampleCardArray.push({ tokenId: v.tokenId, tokenType: v.tokenType, tokenPrice: v.tokenPrice });
            });
            setSampleCardArray(tempSampleCardArray);
        } catch (error) {
            console.log(error);
        }
    };

    const getIsApprovedAccount = async () => {
        try {
            const response = await getIsApproved(account);
            if (response) {
                setSaleStatus(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const onClickApproveToggle = async () => {
        try {
            if (!account) return;
            const response = await setApprovalForAll(account, !saleStatus);
            if (response.status) {
                setSaleStatus(!saleStatus);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getIsApprovedAccount();
        getSampleTokens();
    });

    return (
        <>
            <Flex alignItems={"center"}>
                <Text display={"inline-block"}>Sale Status : {saleStatus ? "TRUE" : "FALSE"}</Text>
                <Button size="sm" ml={2} colorScheme={saleStatus ? "red" : "blue"} onClick={onClickApproveToggle}>
                    {saleStatus ? "Cancel" : "Approve"}
                </Button>
            </Flex>
            <Grid templateColumns="repeat(4, 1fr)" gap={8}>
                {sampleCardArray &&
                    sampleCardArray.map((v, i) => {
                        return (
                            <MySampleCard
                                key={i}
                                tokenPrice={v.tokenPrice}
                                tokenType={v.tokenType}
                                tokenId={v.tokenId}
                                saleStatus={saleStatus}
                                account={account}
                            />
                        );
                    })}
            </Grid>
        </>

    );
};


export default MySample;