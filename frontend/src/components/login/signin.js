import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { setAxiosAuthToken, defaultTime, unsetCurrentUser, setToken } from "../../utils/utils";
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


function SignIn(props) {
    const toast = useToast()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useBoolean(false)
    const [rememberMe, setRememberMe] = useBoolean(false)

    const handleUsernameChange = e => setUsername(e.target.value)
    const handlePasswordChange = e => setPassword(e.target.value)

    const handleSignIn = () => {
        if(username && password){
            const userData = new FormData()
            userData.append('username', username)
            userData.append('password', password)
            login(userData);     
        } else{
            toast({
                title: 'Error',
                description: 'Please fill enter a username and a password',
                status: 'error',
                duration: defaultTime,
                isClosable: true
            })
        }
    }

    const login = (userData) => {
        axios
            .post("api/token/login/", userData)
            .then(response => {
                console.log(response);
                const { auth_token } = response.data;
                setToken(auth_token);
                getCurrentUser("dashboard");
            })
            .catch(error => {
                console.log(error)
                unsetCurrentUser();
                if(error.response.data){
                    for(const [_, value] of Object.entries(error.response.data)){
                        value.map(item => 
                            toast({
                                title: "Error",
                                description: item,
                                status: "error",
                                duration: defaultTime,
                                isClosable: true
                            })
                        )
                    }
                }
            }); 
    }

    const getCurrentUser = redirectTo => {
        axios
          .get("/api/users/me/")
          .then(response => {
            const user = {
              username: response.data.username,
              email: response.data.email
            };
            setCurrentUser(user, redirectTo);
          })
          .catch(error => {
            unsetCurrentUser();
          });
      };

    const setCurrentUser = (user, redirectTo) => {
        localStorage.setItem("user", JSON.stringify(user));
        toast({
            title:"Logged in!",
            description: `Welcome ${user.username}!`,
            status: "success",
            duration: defaultTime,
            isClosable: true
        })
        navigate(redirectTo);

    };


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
                            <ChakraLink color={'blue.400'} onClick={() => props.handleClick("SignUp")}>
                                Don't have an account?
                            </ChakraLink>
                        </Text>
                        <Text align={'center'}>
                            <ChakraLink color={'blue.400'} onClick={() => props.handleClick("ForgotPassword")}>
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

export default SignIn;