import { Box, Button, Input, InputGroup, InputRightAddon, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useState } from "react";
import { sampleTokenContract, web3 } from "../contracts";
import SampleCard from "./SampleCard";

export interface IMySampleCard {
    tokenId: string;
    tokenType: string;
    tokenPrice: string;

}

interface MySampleCardProps extends IMySampleCard {
    saleStatus: boolean;
    account: string;
}
const MySampleCard: FC<MySampleCardProps> = ({
    tokenId,
    tokenType,
    tokenPrice,
    saleStatus,
    account,
}) => {
    const [sellPrice, setSellPrice] = useState<string>("");
    const [mySamplePrice, setMySamplePrice] = useState<string>(tokenPrice);

    const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
        setSellPrice(e.target.value);
    };

    const onClickSell = async () => {
        try {
            if (!account || !saleStatus) return;

            const response = await sampleTokenContract.methods
                .setForSaleToken(
                    tokenId,
                    web3.utils.toWei(sellPrice, "ether")
                )
                .send({ from: account });

            if (response.status) {
                setMySamplePrice(web3.utils.toWei(sellPrice, "ether"));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box textAlign="center" w={150}>
            <SampleCard tokenType={tokenType} />
            <Box mt={2}>
                {mySamplePrice === "0" ? (
                    <>
                        <InputGroup>
                            <Input
                                type="number"
                                value={sellPrice}
                                onChange={onChangeSellPrice}
                            />
                            <InputRightAddon children="Ether" />
                        </InputGroup>
                        <Button size="sm" colorScheme="green" mt={2} onClick={onClickSell}>
                            Sell
                        </Button>
                    </>
                ) : (
                    <Text d="inline-block">
                        {web3.utils.fromWei(mySamplePrice)} ETH
                    </Text>
                )}
            </Box>
        </Box>
    );
};

export default MySampleCard;