import axios from "axios";
import { useState } from "react";
import SignUp from "./signup";
import SignIn from "./signin";
import ForgotPassword from "./forgotPassword";
import ResetPassword from "./resetPassword";
import { Flex, useColorModeValue } from '@chakra-ui/react';

axios.defaults.baseURL = 'http://localhost:8000';

function Login(){
    const [status, setStatus] = useState("SignIn");
    const handleClick = (status) => setStatus(status);
    return(
        <Flex
            flexGrow={1}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.100', 'gray.800')}
            >
            {(() => {
                switch(status) {
                    case 'SignIn':
                        return <SignIn handleClick={handleClick}/>
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
        </Flex>
    )
}

export default Login;