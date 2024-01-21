import {Flex, useColorModeValue} from "@chakra-ui/react";
import {UserCard} from "./userCard";

function Profile(){
    return(
        <Flex
            direction={"column"}
            flexGrow={1}
            align={"center"}
            justify={'center'}
            bg={useColorModeValue('gray.200', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
        >
            <UserCard />
        </Flex>
    )
}

export default Profile;