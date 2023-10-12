import { useState } from "react";
import { setPassword } from "./setActions";
import { defaultTime, emailIsValid } from "../../utils/utils";
import {
    Flex,
    FormControl,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast,
  } from '@chakra-ui/react';

function ForgotPassword(props){
    const toast = useToast()
    const [email, setEmail] = useState("")
    const handleEmailChange = e => setEmail(e.target.value)

    const handleForgotPassword = () => {
        if(emailIsValid(email)){
            const userData = new FormData()
            userData.append('email', email)
            props.handleClick("ResetPassword")
            toast({
                title: 'Reset link sent',
                description: `A reset link was sent to ${email}.`,
                status: 'success',
                duration: defaultTime,
                isClosable: true
            })
            return setPassword(userData);
        }
        toast({
            title: 'Error',
            description: 'Please enter a valid email address',
            status: 'error',
            duration: defaultTime,
            isClosable: true
        })
    }

    return(
        <Flex>
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
                onClick={handleForgotPassword}
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

export default ForgotPassword;