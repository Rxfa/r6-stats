import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Stack,
    Select,
    Divider,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';

export function SortBox(){
    return(
        <Flex
            justify={"center"}
            align={"center"}
        >
            <Stack
                rounded={"2xl"}
                spacing={4}
                p={4}
                boxShadow={"2xl"}
                bg={useColorModeValue('gray.100', 'gray.800')}
                flexGrow={1}
            >
                <Heading textAlign={"center"}>Sort</Heading>
                <FormControl id='id'>
                    <FormLabel textAlign={"center"}>ID</FormLabel>
                    <Select variant={"filled"} placeholder="Select">
                        <option>Asc</option>
                        <option>Desc</option>
                    </Select>
                </FormControl>
                <FormControl id='date'>
                    <FormLabel textAlign={"center"}>Date</FormLabel>
                    <Select variant={"filled"} placeholder="Select">
                        <option>Asc</option>
                        <option>Desc</option>
                    </Select>
                </FormControl>
                <Button colorScheme='messenger' variant={"outline"}>Sort</Button>
            </Stack>
        </Flex>
    )
}
