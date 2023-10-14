import './App.css';
import { ChakraProvider, Stack, useBoolean } from '@chakra-ui/react'
import Table from './components/dashboard/table';
import { useState, useEffect } from 'react';
import { Router, Route, Routes, useNavigate } from "react-router";
import LoginBox from './components/login/loginForm';
import { userToken } from './utils/utils';
import axios from "axios";
import Footer from './components/footer';
import Navbar from './components/header';

axios.defaults.baseURL = 'http://localhost:8000';


const App = () =>{
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useBoolean();

  const checkUserToken = () => {
    if(!userToken || userToken === undefined){
      setIsLoggedIn.off()
      navigate("/")
    } else {
      setIsLoggedIn.on()
      navigate("/dashboard")
    }
  }

  useEffect(() => { checkUserToken() }, [isLoggedIn]);

  return (
    <ChakraProvider>
      <Stack 
        gap={0}
        minH={"full"}>
            <Navbar isLoggedIn={isLoggedIn}/>
            <Routes>
              <Route path="/" element={<LoginBox /> }/>
              <Route path="/dashboard" element={<Table />}/>
            </Routes>
            <Footer/>
      </Stack>
    </ChakraProvider>
  );
};

export default App;
