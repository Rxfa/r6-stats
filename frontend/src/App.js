import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import Table from './components/table';
import { useState, useEffect } from 'react';
import axios from "axios";

const App = () =>{
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/games").then(res => {
      setGames(res.data.results);
      console.log(res.data.results);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  return (
    <ChakraProvider>
      <Table data={games} />
    </ChakraProvider>
  );
};

export default App;
