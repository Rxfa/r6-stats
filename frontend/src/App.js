import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Table from './components/table';
import Login from './components/login';
import { useState, useEffect } from 'react';
import { Router, Route, Routes } from "react-router";
import axios from "axios";


const App = () =>{

  return (
    <ChakraProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Table />} />
        </Routes>
    </ChakraProvider>
  );
};

export default App;
