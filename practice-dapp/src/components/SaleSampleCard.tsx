import { Box, Button, Text, Input } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { sampleTokenContract, web3 } from "../contracts";
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
    const [isRentable, setIsRentable] = useState<boolean>(false);
    const [rentTime, setRentTime] = useState<string>("");
    const [owner, setOwner] = useState<string>("");
    const [user, setUser] = useState<string>("");


    const getSampleTokenOwner = async () => {
        try {
            const response = await sampleTokenContract.methods
                .ownerOf(tokenId)
                .call();
            if (response) {
                setIsBuyable(response.toLocaleLowerCase() === account.toLocaleLowerCase());
                setOwner(response.toLocaleLowerCase());
            }
        } catch (error) {
            console.log(error);
        }
    }


    const getSampleTokenUser = async () => {
        try {
            const response = await sampleTokenContract.methods
                .userOf(tokenId)
                .call();
            if (response) {
                setIsRentable(response.toLocaleLowerCase() !== '0x0000000000000000000000000000000000000000');
                setUser(response.toLocaleLowerCase());
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onClickBuy = async () => {
        try {
            if (!account) return;
            const response = await sampleTokenContract.methods
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

    const onClickRent = async () => {
        try {
            if (!account || !rentTime) return;

            const unixTimestamp = new Date(rentTime).getTime() / 1000;

            console.log(tokenId, account, unixTimestamp);

            const response = await sampleTokenContract.methods
                .setUser(tokenId, account, unixTimestamp)
                .send({ from: account });
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
        getSampleTokenUser();
    }, []);

    return (
        <Box textAlign={'center'} w={150} d="inline-block">
            <SampleCard tokenType={tokenType} />
            <Box >
                <Text d="inline-block">
                    {web3.utils.fromWei(tokenPrice)} Ether
                </Text>
                <Box >
                    <Text>
                        소유자 =  {owner.substring(0, 6)}...
                        <br />
                        임대자 =  {user.substring(0, 6)}...
                    </Text>
                    <Button size={"sm"} colorScheme="green" m={2} disabled={isBuyable} onClick={onClickBuy}>
                        Buy!
                    </Button>
                    <Input
                        onChange={(date) => setRentTime(date.target.value)}
                        placeholder="Select Date and Time"
                        size="xs"
                        type="datetime-local"
                    />
                    <Button size={"sm"} colorScheme="blue" m={2} disabled={isRentable || isBuyable} onClick={onClickRent}>
                        Rent!
                    </Button>
                </Box>
            </Box>
        </Box >);
};

export default SaleSampleCard;