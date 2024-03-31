import axios from "axios";
import {useEffect, useState} from "react";
import {AddModalComponent} from "./add";
import {Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useColorModeValue,} from '@chakra-ui/react';
import {getGames} from "../../services/games";


import {api} from "../../services/axiosConfig";

axios.defaults.baseURL = 'http://localhost:8000';

function GameTableRow(props){
    const game = props.game;
    const own_bans = game.bans.filter(i => i.is_own === true);
    const opp_bans = game.bans.filter(i => i.is_own === false);
    return(
      <Tr>
        <Td>{game.date}</Td>
        <Td>{game.map}</Td>
        <Td>{`${game.won}`}</Td>
        <Td>{`${game.score.own} - ${game.score.opp}`}</Td>
        <Td>{own_bans.ATK ? `${own_bans.ATK}` : "None"}</Td>
        <Td>{own_bans.DEF ? `${own_bans.DEF}` : "None"}</Td>
        <Td>{opp_bans.ATK ? `${opp_bans.ATK}` : "None"}</Td>
        <Td>{opp_bans.DEF ? `${opp_bans.DEF}` : "None"}</Td>
      </Tr>
    );
}


function GameTableComponent() {
    const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [playedMap, setPlayedMap] = useState("");
  const [won, setWon] = useState(false);
  const [ownATKBan, setOwnATKBan] = useState("");
  const [ownDEFBan, setOwnDEFBan] = useState("");
  const [oppATKBan, setOppATKBan] = useState("");
  const [oppDEFBan, setOppDEFBan] = useState("");

  useEffect(() => {
    setIsLoading(true)
    getGames
        .then(res => setGames(res.data))
        .catch(error => console.error(error));
    setIsLoading(false)
  }, []);

  return(
    <TableContainer
     bg={useColorModeValue('white', 'gray.800')}
     rounded={"2xl"}
     boxShadow={"2xl"}
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
          {games.map(game => <GameTableRow game={game}/>)}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default GameTableComponent;