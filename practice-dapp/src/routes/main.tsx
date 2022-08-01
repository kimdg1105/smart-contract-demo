import React, { FC, useState } from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { sampleTokenContract } from "../contracts";
import SampleCard from "../components/SampleCard";

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newTokenType, setNewTokenType] = useState<string>("");

  const onClickMint = async () => {
    try {
      if (!account) return;

      const response = await sampleTokenContract.methods
        .mintToken()
        .send({ from: account });

      if (response.status) {
        const balanceLength = await sampleTokenContract.methods
          .balanceOf(account)
          .call();

        const tokenId = await sampleTokenContract.methods
          .tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10) - 1)
          .call();

        const tokenType = await sampleTokenContract.methods
          .tokenTypes(tokenId)
          .call();

        setNewTokenType(tokenType);
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

export default Main;
