"use client"
import { useState } from "react";
import axios from "axios";
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Box,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link as ChakraLink,
    HStack,
    InputGroup,
    InputRightElement,
    useToast,
    useBoolean
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {useRouter} from "next/navigation";

import { signup } from "@/app/api/auth";
axios.defaults.baseURL = 'http://localhost:8000';

export default function Page(props){
    const router = useRouter()
    const toast = useToast()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [showPassword, setShowPassword] = useBoolean(false)

    const handleFirstNameChange = e => setFirstName(e.target.value)
    const handleLastNameChange = e => setLastName(e.target.value)
    const handleUsernameChange = e => setUsername(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)
    const handleEmailChange = e => setEmail(e.target.value)

    const handleSignUp = () => {
        signup({
            firstname: firstName,
            lastname: lastName,
            email: email,
            username: username,
            password: password
        }).then(() => router.push("signin"))
    }

    return (
        <Flex>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Sign up
                    </Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl id="firstName">
                                    <FormLabel>First Name</FormLabel>
                                    <Input type="text" onChange={handleFirstNameChange}/>
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="lastName">
                                    <FormLabel>Last Name</FormLabel>
                                    <Input type="text" onChange={handleLastNameChange}/>
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" onChange={handleEmailChange}></Input>
                        </FormControl>
                        <FormControl id="username" isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" onChange={handleUsernameChange}/>
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} onChange={handlePasswordChange}/>
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword.toggle()}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                onClick={handleSignUp}
                                loadingText="Submitting"
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Already a user?
                            </Text>
                            <Text align={'center'}>
                                <ChakraLink
                                    color={'blue.400'}
                                    onClick={() => router.push("signin")}
                                >
                                    Sign-In
                                </ChakraLink>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}
