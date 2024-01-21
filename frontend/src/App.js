import './App.css';
import {ChakraProvider, Stack} from '@chakra-ui/react'
import {Route, Routes} from "react-router";
import {useState} from 'react';
import Login from './components/login/login';
import axios from "axios";
import Footer from './components/footer';
import Navbar from './components/header';
import Dashboard from './components/dashboard/dashboard';
import Profile from './components/profile/profile';

axios.defaults.baseURL = 'http://localhost:8000';


const App = () =>{
  const [isLogged, setIsLogged] = useState(false);
  /**
   * TODO: Add protected routes
   */
  return (
    <ChakraProvider>
      <Stack 
        gap={0}
        minH={"full"}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Login /> }/>
              <Route path="/dashboard" element={<Dashboard />}/>
              <Route path="/profile" element={<Profile />}/>
            </Routes>
            <Footer/>
      </Stack>
    </ChakraProvider>
  );
};

export default App;
