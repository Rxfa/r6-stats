import { useState } from "react";

import {
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
  } from '@chakra-ui/react'

function Login() {
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')

    const handleInputEmailChange = (e) => setInputEmail(e.target.value)
    const handleInputPasswordChange = (e) => setInputPassword(e.target.value)

    const isError = inputEmail === ''

    return (
        <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>

            <FormControl isInvalid={isError}>
            <FormLabel>Email</FormLabel>
            <Input type='email' value={inputEmail} onChange={handleInputEmailChange} />
            {!isError ? (
                <FormHelperText>
                We'll never share your email.
                </FormHelperText>
            ) : (
                <FormErrorMessage>Email is required.</FormErrorMessage>
                )}
            <Input type="password" value={inputPassword} onChange={handleInputPasswordChange} />
            </FormControl>
        </Flex>
    )
}

export default Login;