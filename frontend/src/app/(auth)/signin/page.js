"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
    Flex,
    FormControl,
    FormLabel,
    Input,
    Box,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link as ChakraLink,
    InputGroup,
    InputRightElement,
    useToast,
    useBoolean
} from '@chakra-ui/react';

import { signin } from "@/app/api/auth";

export default function Page(props) {
    const toast = useToast()
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useBoolean(false)
    const [rememberMe, setRememberMe] = useBoolean(false)

    const handleUsernameChange = e => setUsername(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)

    const handleSignIn = () => {
        signin(username, password).then(() => router.push("games"))
    }

    return (
        <Flex>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input type="text" onChange={handleUsernameChange} />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} onChange={handlePasswordChange} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword.toggle()}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}
                            >
                                <Checkbox onChange={() => setRememberMe.toggle()}>Remember me</Checkbox>
                            </Stack>
                            <Stack>
                                <Text align={'center'}>
                                    <ChakraLink color={'blue.400'} onClick={() => router.push("signup")}>
                                        Don't have an account?
                                    </ChakraLink>
                                </Text>
                                <Text align={'center'}>
                                    <ChakraLink color={'blue.400'} onClick={() => router.push("forgotpassword")}>
                                        Forgot Username / Password?
                                    </ChakraLink>
                                </Text>
                            </Stack>
                            <Button
                                onClick={handleSignIn}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}