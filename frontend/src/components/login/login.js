import axios from "axios";
import {useEffect, useState} from "react";
import SignUp from "./signup";
import SignIn from "./signin";
import ForgotPassword from "./forgotPassword";
import ResetPassword from "./resetPassword";
import {Flex, useColorModeValue} from '@chakra-ui/react';
import {useNavigate} from "react-router";
import {getUser} from "../../services/services";

function Login(){
    const navigate = useNavigate();
    const user = getUser();
    const isAuthenticated = !!user;

    useEffect(() => {
        if(isAuthenticated)
            navigate("/dashboard");
    }, []);

    const [status, setStatus] = useState("SignIn");

    const handleClick = (status) => setStatus(status);
    return(
        <Flex
            flexGrow={1}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.200', 'gray.900')}
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