import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Table from './components/table';
import { useState, useEffect } from 'react';
import { Router, Route, Routes } from "react-router";
import LoginBox from './components/loginForm';
import Header from './components/header';
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8000';


const App = () =>{

  return (
    <>
      <ChakraProvider>
          <Routes>
            <Route path="/" element={<LoginBox />} />
            <Route path="/dashboard" element={<Table />} />
          </Routes>
      </ChakraProvider>
    </>
  );
};

export default App;
