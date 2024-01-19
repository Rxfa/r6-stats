import axios from "axios";
import { useState, useEffect } from "react";
import { FilterBox } from "./filter";
import { SortBox } from "./sort";
import {
  Flex,
  HStack,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import GameTableComponent from "./gameTable";
import TableTabsComponent from "./tableTabs";
import { isLogged } from "../../utils/utils";
import { useNavigate } from "react-router";

axios.defaults.baseURL = 'http://localhost:8000';

function Dashboard(){

  const [games, setGames] = useState([]);
  const [checkedGames, setCheckedGames] = useState([]);
  const [checkedGamesIds, setCheckedGamesIds] = useState([]);
  const [date, setDate] = useState("");
  const [playedMap, setPlayedMap] = useState("");
  const [ownScore, setOwnScore] = useState("");
  const [oppScore, setOppScore] = useState("");
  const [ownATKBan, setOwnATKBan] = useState("");
  const [ownDEFBan, setOwnDEFBan] = useState("");
  const [oppATKBan, setOppATKBan] = useState("");
  const [oppDEFBan, setOppDEFBan] = useState("");
  const navigate = useNavigate();
  const stackSpacing = 8;

  useEffect(() => {
    axios.get("games").then(res => {
      setGames(res.data.results);
      console.log(res.data.results);
    }).catch(error => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    axios.get(
      `games/?date=${date}&id=${checkedGamesIds}&map=${playedMap}&own_score=${ownScore}&opp_score=${oppScore}&own_atk_ban=${ownATKBan}&own_def_ban=${ownDEFBan}&opp_atk_ban=${oppATKBan}&opp_def_ban=${oppDEFBan}`
      ).then(res => {
        setGames(res.data.results);
      setCheckedGames(res.data.results);
      console.log(res.data.results);
    }).catch(error => {
      console.error(error);
    });
  }, [checkedGamesIds, date, oppATKBan, oppDEFBan, oppScore, ownATKBan, ownDEFBan, ownScore, playedMap]);

   return(
    <Flex 
      direction={"column"}
      justify={'center'}
      bg={useColorModeValue('gray.200', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Stack spacing={stackSpacing}>
        <TableTabsComponent/>
      </Stack>
    </Flex>
   ) 
}

export default Dashboard;