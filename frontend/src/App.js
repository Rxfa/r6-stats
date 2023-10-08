import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Table from './components/table';
import { useState, useEffect } from 'react';
import { Router, Route, Routes } from "react-router";
import axios from "axios";
import LoginBox from './components/loginForm';


const App = () =>{

  return (
    <ChakraProvider>
        <Routes>
          <Route path="/" element={<LoginBox />} />
          <Route path="/home" element={<Table />} />
        </Routes>
    </ChakraProvider>
  );
};

export default App;
