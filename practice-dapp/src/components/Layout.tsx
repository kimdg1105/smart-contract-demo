import React, { FC } from "react";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Layout: FC = ({ children }) => {
    return (
        <Stack h={"100vh"}>
            <Flex
                bg={"green.200"}
                p={4}
                justifyContent="space-around"
                alignItems="center"
            >
                <Text fontWeight="bold">Smart Contract Practice</Text>
                <Link to={"/"}>
                    <Button size="sm" colorScheme={"orange"}>Main</Button>
                </Link>
                <Link to={"sale-sample"}>
                    <Button size="sm" colorScheme={"yellow"}>MarketPlace</Button>
                </Link>
                <Link to={"my-sample"}>
                    <Button size="sm" colorScheme={"blue"}>My Samples</Button>
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
        </Stack>
    );
};

export default Layout;