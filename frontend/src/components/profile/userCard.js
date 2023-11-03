import { 
    Avatar, 
    Stack, 
    useColorModeValue, 
    FormControl, 
    FormLabel, 
    Select, 
    Divider, 
    Text,
    Badge
} from "@chakra-ui/react";
import { getUser } from "../../utils/utils";
import { ChangePassword } from "./changePassword";
import { ChangeUsername } from "./changeUsername";
import { DeleteAccount } from "./delete";

export function UserCard(){
    const user = getUser()
    return(
        <Stack
            bg={useColorModeValue('gray.100', 'gray.800')}
            rounded={"2xl"}
            boxShadow={"2xl"}
            p={8}
            spacing={4}
            justify={"center"}
            align={"center"}
        >
            <Avatar 
                size={"2xl"} 
                src={'https://en.meming.world/images/en/thumb/1/10/Yellow_Glasses_Guy.jpg/300px-Yellow_Glasses_Guy.jpg'}
            />
            <Badge width={"fit-content"} colorScheme='green'>
                New
            </Badge>
            <Text as={"b"} textAlign={"center"} fontSize={"2xl"}>{user.username}</Text>
            <Divider />
            <ChangeUsername />
            <ChangePassword />
            <DeleteAccount />
        </Stack>
    )

}