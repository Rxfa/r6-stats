import { ThemeProvider } from "@emotion/react";
import theme from "../../themes/theme";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { AddModalComponent } from "./add";
import { DeleteAlertComponent } from "./delete";
import { ViewModalComponent } from "./view";
import {
  Bar,
  BarChart,
  ResponsiveContainer
} from "recharts";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Box,
  Checkbox,
  IconButton,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  FormErrorMessage,
  FormHelperText,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  RadioGroup,
  Radio,
  Stack,
  useDisclosure,
  useColorModeValue,
  Button,
  Select,
  Divider,
  Heading,
} from '@chakra-ui/react';

axios.defaults.baseURL = 'http://localhost:8000';

function TableComponent() {

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

  useEffect(() => {
    axios
      .get("games")
      .then(
        res => {
          setGames(res.data.results);
          console.log(res.data.results);
        })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    axios
    .get(
      `games/?date=${date}&id=${checkedGamesIds}&map=${playedMap}&own_score=${ownScore}&opp_score=${oppScore}&own_atk_ban=${ownATKBan}&own_def_ban=${ownDEFBan}&opp_atk_ban=${oppATKBan}&opp_def_ban=${oppDEFBan}`
    )
    .then(
      res => {
        setGames(res.data.results);
        setCheckedGames(res.data.results);
        console.log(res.data.results);
      }
    )
    .catch(error => console.error(error));
  }, [checkedGamesIds, date, oppATKBan, oppDEFBan, oppScore, ownATKBan, ownDEFBan, ownScore, playedMap]);

  /**
   * TODO: Get rid of the useEffect hook and make it do a request to the API only when
   * search button in the filter form is pressed.
   * ???Make it a function called on click???
   */
  return(
    <TableContainer 
    bg={useColorModeValue('gray.100', 'gray.800')}
    rounded={"2xl"}>
      <Stack direction={"row-reverse"} spacing={"auto"} py={"4"} mx={"6"}>
        {
          checkedGamesIds.length >= 1 ? (
            <>
              <DeleteAlertComponent />
              <ViewModalComponent />
            </>
          ) : checkedGamesIds.length === 0 ? (
            <AddModalComponent />
          ) : null
        }
      </Stack>
      <Table size="lg">
        <Thead>
          <Th>
            <Checkbox
              size={"lg"}
              colorScheme="messenger"
              isChecked={checkedGamesIds.length === games.map(row => row.id).length}
              onChange={() => {
                const gameIds = games.map(row => row.id)
                if (checkedGamesIds.length === gameIds.length){
                  setCheckedGamesIds([])
                } else {
                  setCheckedGamesIds(gameIds)
                }
              }}
            >
              ID
            </Checkbox>
          </Th>
          <Th>Date</Th>
          <Th>Map</Th>
          <Th>Score</Th>
          <Th>Own - ATK ban</Th>
          <Th>Own - DEF ban</Th>
          <Th>Opp - ATK ban</Th>
          <Th>Opp - DEF ban</Th>
        </Thead>
        <Tbody>
          {
            games.map(row => (
              <Tr>
                <Td>
                  <Checkbox
                    colorScheme="messenger"
                    size={"lg"}
                    isChecked={
                      checkedGamesIds.includes(row.id)
                    }
                    onChange={() => {
                      console.log(checkedGamesIds)
                      const idx = checkedGamesIds.indexOf(row.id)
                      if(idx !== -1){
                        setCheckedGamesIds([...checkedGamesIds.slice(0, idx), ...checkedGamesIds.slice(idx+1)])
                      } else {
                        setCheckedGamesIds([...checkedGamesIds, row.id])
                      }
                    }}
                  >
                    {row.id}
                  </Checkbox>
                </Td>
                <Td>{row.date}</Td>
                <Td>{row.map}</Td>
                <Td>{row.score}</Td>
                <Td>{row.own_atk_ban}</Td>
                <Td>{row.own_def_ban}</Td>
                <Td>{row.opp_atk_ban}</Td>
                <Td>{row.opp_def_ban}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default TableComponent;