import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AddModalComponent } from "./add";
import { DeleteAlertComponent } from "./delete";
import { ViewModalComponent } from "./view";
import {
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { axios_instance } from "../../utils/utils";

axios.defaults.baseURL = 'http://localhost:8000';

function GameTableComponent() {

  const [games, setGames] = useState([]);
  const [playedMap, setPlayedMap] = useState("");
  const [won, setWon] = useState(false);
  const [ownATKBan, setOwnATKBan] = useState("");
  const [ownDEFBan, setOwnDEFBan] = useState("");
  const [oppATKBan, setOppATKBan] = useState("");
  const [oppDEFBan, setOppDEFBan] = useState("");

  useEffect(() => {
    axios_instance
      .get("games/")
      .then(
        res => {
          console.log(res.data);
          setGames(res.data);
        }
      )
      .catch(error => console.error(error));
  }, []);

  return(
    <TableContainer 
     bg={useColorModeValue('white', 'gray.800')}
     rounded={"2xl"}
     boxShadow={"2xl"}
     minHeight={"3xl"}
         
    >
      <Stack direction={"row-reverse"} spacing={"auto"} py={"4"} mx={"6"}>
        <AddModalComponent />
      </Stack>
      <Table>
        <Thead>
          <Th>Date</Th>
          <Th>Map</Th>
          <Th>Won</Th>
          <Th>Score</Th>
          <Th>Own - ATK ban</Th>
          <Th>Own - DEF ban</Th>
          <Th>Opp - ATK ban</Th>
          <Th>Opp - DEF ban</Th>
        </Thead>
        <Tbody>
          {
            games.map(game => (
              <Tr>
                <Td>{game.date}</Td>
                <Td>{game.map}</Td>
                <Td>{game.won}</Td>
                <Td>{`${game.score.own} - ${game.score.opp}`}</Td>
                <Td>{game.bans.find(a => a.is_own === true).ATK}</Td>
                <Td>{game.bans.find(a => a.is_own === true).DEF}</Td>
                <Td>{game.bans.find(a => a.is_own === false).ATK}</Td>
                <Td>{game.bans.find(a => a.is_own === false).DEF}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default GameTableComponent;