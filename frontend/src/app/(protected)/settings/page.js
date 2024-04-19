import {Box, Button, Flex, Heading, Stack} from "@chakra-ui/react";

export default function Page(){
    return(
        <Flex flexDirection={"column"} justifyContent={"space-around"}>
            <Heading>Settings</Heading>
            <Stack>
                <Button>Lorem Ipsum</Button>
                <Button>Lorem Ipsum</Button>
                <Button>Lorem Ipsum</Button>
            </Stack>
        </Flex>
    )
}