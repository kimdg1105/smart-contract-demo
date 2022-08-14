import { FC } from "react";
import { Button, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Layout: FC = ({ children }) => {
    return (
        <Stack h={"150vh"} order={1}  >
            <Flex
                bg={"blue.100"}
                p={4}
                justifyContent="space-around"
                alignItems="center"
            >
                <Text
                    fontSize="2xl"
                    color={useColorModeValue("gray.800", "gray.600")}
                >
                    Smart Contract Practice
                </Text>
                <Link to={"/"}>
                    <Button size="md" colorScheme={"blue"}>Mint</Button>
                </Link>
                <Link to={"sale-sample"}>
                    <Button size="md" colorScheme={"blue"}>MarketPlace</Button>
                </Link>
                <Link to={"my-sample"}>
                    <Button size="md" colorScheme={"blue"}>My Samples</Button>
                </Link>
            </Flex>
            <Flex
                direction={"column"}
                h="full"
                justifyContent="center"
                alignItems="center"
            >
                {children}
            </Flex>
        </Stack >
    );
};

export default Layout;
