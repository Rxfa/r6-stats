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

function TableComponent() {

  const [rounds, setRounds] = useState([]);
  const [checkedRounds, setCheckedRounds] = useState([]);
  const [date, setDate] = useState("");
  const [playedMap, setPlayedMap] = useState("");
  const [playedSite, setPlayedSite] = useState("");
  const [won, setWon] = useState(false);
  const [ownATKBan, setOwnATKBan] = useState("");
  const [ownDEFBan, setOwnDEFBan] = useState("");
  const [oppATKBan, setOppATKBan] = useState("");
  const [oppDEFBan, setOppDEFBan] = useState("");

  useEffect(() => {
    axios_instance
      .get("/rounds/")
      .then(
        res => {
          console.log(res.data);
          setRounds(res.data);
          setCheckedRounds(res.data);
        }
      )
      .catch(error => console.error(error));
  }, []);

  /**
   * TODO: Get rid of the useEffect hook and make it do a request to the API only when
   * search button in the filter form is pressed.
   * ???Make it a function called on click???
   */
  return(
    <TableContainer 
     bg={useColorModeValue('white', 'gray.800')}
     rounded={"2xl"}
     boxShadow={"2xl"}
     minHeight={"3xl"}
         
    >
      <Stack direction={"row-reverse"} spacing={"auto"} py={"4"} mx={"6"}>
        {
          checkedRounds.length >= 1 ? (
            <>
              <DeleteAlertComponent />
              <ViewModalComponent />
            </>
          ) : checkedRounds.length === 0 ? (
            <AddModalComponent />
          ) : null
        }
      </Stack>
      <Table>
        <Thead>
          <Th>
            <Checkbox
              colorScheme="messenger"
              isChecked={checkedRounds.length === rounds.length}
              onChange={() => {
                const gameIds = rounds.map(row => row.id)
                if (checkedRounds.length === rounds.length){
                  setCheckedRounds([])
                } else {
                  setCheckedRounds(gameIds)
                }
              }}
            />
          </Th>
          <Th>Date</Th>
          <Th>Map</Th>
          <Th>Site</Th>
          <Th>Won</Th>
          <Th>Side</Th>
          <Th>Own - ATK ban</Th>
          <Th>Own - DEF ban</Th>
          <Th>Opp - ATK ban</Th>
          <Th>Opp - DEF ban</Th>
        </Thead>
        <Tbody>
          {
            rounds.map(row => (
              <Tr>
                <Td>
                  <Checkbox
                    colorScheme="messenger"
                    isChecked={
                      checkedRounds.includes(row.id)
                    }
                    onChange={() => {
                      const idx = checkedRounds.indexOf(row.id)
                      if(idx !== -1){
                        setCheckedRounds([...checkedRounds.slice(0, idx), ...checkedRounds.slice(idx+1)])
                      } else {
                        setCheckedRounds([...checkedRounds, row.id])
                      }
                    }}
                  />
                </Td>
                <Td>{row.dateTime}</Td>
                <Td>{row.map}</Td>
                <Td>{row.site}</Td>
                <Td>{`${row.teams[0].won}`}</Td>
                <Td>{row.teams[0].side}</Td>
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