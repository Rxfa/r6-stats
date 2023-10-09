import { useState } from "react";
import { emailIsValid, withRouter } from "../utils/utils";
import axios from "axios";
import { connect } from "react-redux";
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
    HStack,
    InputGroup,
    InputRightElement,
    useToast,
    useBoolean
  } from '@chakra-ui/react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
  import { signupNewUser } from "./login/signupActions";
  import { login } from "./login/loginActions";

axios.defaults.baseURL = 'http://localhost:8000';

const defaultTime = 8000;

function SignUp(props){

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
        if(email && username && password){
            if(emailIsValid(email)){
                const userData = {
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    username: username,
                    password: password
                };
                return [
                    toast({
                        title: "Account created",
                        description: "We've created your account for you.",
                        status: 'success',
                        duration: defaultTime,
                        isClosable: true
                    }),
                    signupNewUser(userData)
                ];
            } else {
                return toast({
                    title: 'Invalid email',
                    description: 'Please enter a valid email address',
                    status: 'error',
                    duration: defaultTime,
                    isClosable: true
                })
            }
        } else {
            return toast({
                title: 'Error',
                description: 'Please fill all the required fields valid information',
                status: 'error',
                duration: defaultTime,
                isClosable: true
            })    
        }
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
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
                             onClick={() => props.handleClick("SignIn")}
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

function SignIn(props) {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useBoolean(false)

    const handleUsernameChange = (e) => setUser(e.target.value)
    const handlePasswordChange = (e) => setPassword(e.target.value)

    const handleSignIn = () => {
        const userData = new FormData()
        userData.append('username', user)
        userData.append('password', password)
        login(userData, '/dashboard');
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
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
                    <Input type="password" onChange={handlePasswordChange} />
                </FormControl>
                <Stack spacing={10}>
                    <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}>
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
                        }}>
                    Sign in
                    </Button>
                </Stack>
                </Stack>
            </Box>
            </Stack>
        </Flex>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
});

connect(mapStateToProps, {
    login
  })(withRouter(SignIn));


function ForgotPassword(props){

    const toast = useToast()

    const [email, setEmail] = useState("")

    const handleEmailChange = (e) => setEmail(e.target.value)

    return(
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                Forgot your password?
            </Heading>
            <Text
                fontSize={{ base: 'sm', sm: 'md' }}
                color={useColorModeValue('gray.800', 'gray.400')}>
                You&apos;ll get an email with a reset link
            </Text>
            <FormControl id="email">
                <Input
                onChange={handleEmailChange}
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                />
            </FormControl>
            <Stack spacing={6}>
                <Button
                onClick={() => {
                    if(emailIsValid(email)){
                        toast({
                            title: 'Reset link sent',
                            description: `A reset link was sent to ${email}.`,
                            status: 'success',
                            duration: defaultTime,
                            isClosable: true
                        })
                        props.handleClick("ResetPassword")
                    } else {
                        toast({
                            title: 'Reset link not sent',
                            description: 'The email you entered is invalid',
                            status: 'error',
                            duration: defaultTime,
                            isClosable: true
                        })
                    }
                }}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                    bg: 'blue.500',
                }}>
                Request Reset
                </Button>
            </Stack>
            </Stack>
        </Flex>
    )
}

function ResetPassword(props){

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    return (
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
              Enter new password
            </Heading>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" />
            </FormControl>
            <Stack spacing={6}>
              <Button
                onClick={() => props.handleClick('SignIn')}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
    )
}

function LoginBox(){
    const [status, setStatus] = useState("SignIn");

    const handleClick = (status) => {
        setStatus(status);
    }

    return(
        <>
            {(() => {
                switch(status) {
                    case 'SignIn':
                        return <SignIn handleClick={handleClick} />
                    case 'SignUp':
                        return <SignUp handleClick={handleClick} />
                    case 'ForgotPassword':
                        return <ForgotPassword handleClick={handleClick} />
                    case 'ResetPassword':
                        return <ResetPassword handleClick={handleClick} />
                    default:
                        return null
                }
            })()}
        </>
    )
}

export default LoginBox;