import { Box, Button, Text, Input } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useWeb3Auth } from "../services/web3auth";
import SampleCard from "./SampleCard";
interface SaleSampleCardProps {
    tokenType: string;
    tokenPrice: string;
    tokenId: string;
    account: string;
    getOnSaleSampleTokens: () => Promise<void>;
}

const SaleSampleCard: FC<SaleSampleCardProps> = ({ tokenType, tokenPrice, tokenId, account, getOnSaleSampleTokens }) => {
    const { provider, purchaseToken, setTokenUser } = useWeb3Auth();
    const { ownerOf, userOf } = useWeb3Auth();
    const [isBuyable, setIsBuyable] = useState<boolean>(false);
    const [isRentable, setIsRentable] = useState<boolean>(false);
    const [rentTime, setRentTime] = useState<string>("");
    const [owner, setOwner] = useState<string>("");
    const [user, setUser] = useState<string>("");


    const getSampleTokenOwner = async () => {
        try {
            const response = await ownerOf(tokenId);
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
            const response = await userOf(tokenId);
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
            const response = await purchaseToken(account, tokenId, tokenPrice);
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
            const response = await setTokenUser(account, tokenId, unixTimestamp);
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
    });

    return (
        <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' textAlign={'center'} w={200} d="inline-block">
            <SampleCard tokenType={tokenType} />
            <Box p='5'>
                <Box display='flex' alignItems='baseline'>
                    <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        textTransform='uppercase'
                        ml='2'
                    >
                        소유자  {owner.substring(0, 10)}...
                        <br />
                        임대자  {user.substring(0, 10)}...
                    </Box>
                </Box>

                <Box
                    mt='3'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                >
                    {"NFT 타이틀"}
                </Box>
                <Box>
                    <Text d="inline-block">
                        {provider!.web3.utils.fromWei(tokenPrice)}
                    </Text>
                    <Box as='span' color='gray.600' fontSize='sm'>
                        / Ether
                    </Box>
                </Box>
                <Box >
                    <Button size={"sm"} colorScheme="green" m={2} disabled={isBuyable} onClick={onClickBuy}>
                        Buy!
                    </Button>
                    <Input
                        onChange={(date) => setRentTime(date.target.value)}
                        placeholder="Select Date and Time"
                        size="xs"
                        type="datetime-local"
                    />
                    <Button size={"sm"} colorScheme="yellow" m={2} disabled={isRentable || isBuyable} onClick={onClickRent}>
                        Rent!
                    </Button>
                </Box>
            </Box>
        </Box >
    );
};

export default SaleSampleCard;