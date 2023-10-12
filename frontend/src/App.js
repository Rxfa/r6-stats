import './App.css';
import { ChakraProvider, Stack, useBoolean } from '@chakra-ui/react'
import Table from './components/table';
import { useState, useEffect } from 'react';
import { Router, Route, Routes } from "react-router";
import LoginBox from './components/login/loginForm';
import { isLogged } from './utils/utils';
import axios from "axios";
import Footer from './components/footer';
import Navbar from './components/header';

axios.defaults.baseURL = 'http://localhost:8000';


const App = () =>{
  const [isLoggedIn, setIsLoggedIn] = useBoolean()
  useEffect(() => {
    if(isLogged){
      setIsLoggedIn.on()
    } else {
      setIsLoggedIn.off()
    }
  }, [setIsLoggedIn])
  return (
    <ChakraProvider>
      <Stack 
        gap={0}
        minH={"full"}>
            <Navbar isLoggedIn={isLoggedIn}/>
            <Routes>
              <Route path="/" element={<LoginBox />} />
              <Route path="/dashboard" element={<Table />} />
            </Routes>
            <Footer/>
      </Stack>
    </ChakraProvider>
  );
};

export default App;
