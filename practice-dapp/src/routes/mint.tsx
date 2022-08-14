import { FC, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import SampleCard from "../components/SampleCard";
import { useWeb3Auth } from "../services/web3auth";
interface MintProps {
  account: string;
}

const Mint: FC<MintProps> = () => {
  const { getAccounts, mintToken, balanceOf, tokenOfOwnerByIndex, tokenType } = useWeb3Auth();
  const [newTokenType, setNewTokenType] = useState<string>("");

  const onClickMint = async () => {
    try {
      const accounts = await getAccounts();
      const account = accounts[0];


      const response = await mintToken(account);
      if (response.status) {
        const balanceLength = await balanceOf(account);
        const tokenId = await tokenOfOwnerByIndex(balanceLength);
        const newTokenType = await tokenType(tokenId);
        setNewTokenType(newTokenType);

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      w="full"
      h="100vh"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Box>
        {newTokenType ? (
          <SampleCard tokenType={newTokenType}></SampleCard>
        )
          : (
            <div>No Items.</div>
          )}
      </Box>
      <Button mt={4} size="sm" colorScheme="green" onClick={onClickMint}> Mint! </Button>
    </Flex>
  );
};

export default Mint;
