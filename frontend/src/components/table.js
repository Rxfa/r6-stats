import { ThemeProvider } from "@emotion/react";
import theme from "../themes/theme";
import "../App.css";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
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

import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  ViewIcon
} from '@chakra-ui/icons';

axios.defaults.baseURL = 'http://localhost:8000';

function AddModalComponent(){
  const { isOpen, onOpen, onClose } = useDisclosure()
  return(
      <>
          <Button colorScheme="messenger" leftIcon={<AddIcon />} maxWidth={"max-content"} onClick={onOpen}>
            Add
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>Stats</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                      Add
                  </ModalBody>
                  <ModalFooter>
                      <Button colorScheme='red' mr={2} onClick={onClose}>
                      Close
                      </Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </>
  );
}

function ChartData(games, map){
  /*
  var data = {
    "Atk": {},
    "Def": {},
  }
  data.atk = getSites(data, map) // TODO: Add fields
  data.def = getSites(data, map) //TODO: Add fields
  data.forEach(i => (
    i.site.won = games.filter(game => (game.map === map & game.side === i & game.won === true)).length,
    i.site.lost = games.filter(game => (game.map === map & game.side === i & game.won === false)).length,
    i.site.played = i.site.won + i.site.lost))
  return data*/
}

function getSites(src, map, ...fields){
  //TODO: Not implemented yet
}

function ViewModalComponent(games){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedMap, setSelectedMap] = useState([]);
  //const maps = useConst(() => 
  //  games.map(game => (game.map)).filter((val, idx, self) => (idx === self.indexOf(val)))
  //)
  return(
      <>
          <Button colorScheme="messenger" mr={6} leftIcon={<ViewIcon />} maxWidth={"max-content"} onClick={onOpen}>
              View
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="xl">
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>Stats</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Tabs>
                        <TabList>
                            <Tab>General</Tab>
                            { games.length === 1 && <Tab>Rounds</Tab> }
                            <Tab>Individual</Tab>
                        </TabList>
                        <TabPanels>
                              <TabPanel>
                                <Menu>
                                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                    Map
                                  </MenuButton>
                                  <MenuList>
                                  <MenuItem onClick={
                                    () => {
                                      setSelectedMap()
                                      alert(`${selectedMap}`)
                                    }}>
                                    General
                                  </MenuItem>
                                    {/*
                                      maps.map(map => (
                                        <MenuItem onClick={() => {
                                          setSelectedMap(map)
                                          alert(`${map}`)
                                          }}>
                                          {map}
                                        </MenuItem>
                                      ))
                                        */}
                                  </MenuList>
                                </Menu>
                                <ResponsiveContainer maxWidth="100%" maxHeight="100%">
                                    <BarChart width={140} height={40} data={ChartData(games, selectedMap)}>
                                      {
                                        /*
                                          <Bar dataKey={}/>
                                         */
                                      }
                                    </BarChart>
                                </ResponsiveContainer>
                              </TabPanel>
                              {
                                games.length === 1 &&
                                <TabPanel>
                                  <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Number</Th>
                                            <Th>Map</Th>
                                            <Th>Site</Th>
                                            <Th>Side</Th>
                                            <Th>Won</Th>
                                            <Th>Win Condition</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                      {}
                                    </Tbody>
                                  </Table>
                                </TabPanel> 
                              }
                              <TabPanel></TabPanel>
                          </TabPanels>
                    </Tabs>
                  </ModalBody>
                  <ModalFooter>
                      <Button colorScheme='red' mr={2} onClick={onClose}>
                      Close
                      </Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </>
  );
}

function DeleteAlertComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  return(
    <>
    <Button colorScheme="red" leftIcon={<DeleteIcon />} maxWidth={"max-content"} onClick={onOpen}>
      Delete
    </Button>

    <AlertDialog 
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef} 
      onClose={onClose}
      isOpen={isOpen} 
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Delete game
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you Sure? 
          You won't be able to undo this action afterwards.
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onClose} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}

function FilterBox(...params){
  const [mappool, setMapPool] = useState([]);
  const [atkOps, setAtkOps] = useState([]);
  const [defOps, setDefOps] = useState([]);
  const [radio, setRadio] = useState("");

  useEffect(() => {
    axios.get("operators?side=ATK").then(res => {
      const operators = res.data.map(item => item.name);
      setAtkOps(operators);
    }).catch(error => {
      console.error(error);
    })
  }, [])

  useEffect(() => {
    axios.get("operators?side=DEF").then(res => {
      const operators = res.data.map(item => item.name);
      setDefOps(operators);
    }).catch(error => {
      console.error(error);
    })
  }, [])

  useEffect(() => {
    axios.get("mappool").then(res => {
      const maps = res.data.map(item => item.name);
      setMapPool(maps);
    }).catch(error => {
      console.error(error);
    })
   }, []);
   
  return(
    <Flex 
     justify={"center"}
     align={"center"}
    >
      <Stack 
       rounded={"xl"}
       spacing={4}
       p={4}
       boxShadow={"2xl"}
      >
        <Heading textAlign={"center"}>Filters</Heading>
        <Divider direction={"horizontal"} />
        <FormControl id="result">
          <FormLabel textAlign={"center"}>Result</FormLabel>
          <Select placeholder="Select">
                <option value={"Win"}>Win</option>
                <option value={"Draw"}>Draw</option>
                <option value={"Loss"}>Loss</option>
          </Select>
        </FormControl>
        <FormControl id="map">
          {
            // Do date
          }
          <FormLabel textAlign={"center"}>Map</FormLabel>
          <Select placeholder="Select">
            {
              mappool.map((val, idx) => {
                console.log(`[mappool] - ${mappool}`)
                return <option value={`${val}${idx}`}>{val}</option>
              })
            }
          </Select>
        </FormControl>
        <HStack spacing={4}>
          <Box>
            <FormControl id="ownATKBan">
              <FormLabel textAlign={"center"}>Own ATK ban</FormLabel> 
              <Select placeholder="Select">
                {
                  atkOps.map((val, idx) => <option value={`${val}${idx}`}>{val}</option>)
                }  
              </Select> 
            </FormControl>
          </Box>
          <Box>
            <FormControl id="ownDEFBan">
              <FormLabel textAlign={"center"}>Own DEF ban</FormLabel>
              <Select placeholder="Select">
                {
                  defOps.map((val, idx) => 
                    <option value={`${val}${idx}`}>{val}</option>
                  )
                } 
              </Select> 
            </FormControl>
          </Box>
        </HStack>
        <HStack>
        <Box>
            <FormControl id="oppATKBan"> 
              <FormLabel textAlign={"center"}>Opp ATK ban</FormLabel> 
              <Select placeholder="Select">
                {
                  atkOps.map((val, idx) => <option value={`${val}${idx}`}>{val}</option>)
                }  
              </Select>      
            </FormControl>
          </Box>
          <Box>
            <FormControl id="oppDEFBan"> 
              <FormLabel textAlign={"center"}>Opp DEF ban</FormLabel>
              <Select placeholder="Select">
                {
                  defOps.map((val, idx) => 
                    <option value={`${val}${idx}`}>{val}</option>
                  )
                } 
              </Select>
            </FormControl>
          </Box>
        </HStack>
      </Stack>
    </Flex>
  )
}

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

  /**
   * TODO: Get rid of the useEffect hook and make it do a request to the API only when
   * search button in the filter form is pressed.
   * ???Make it a function called on click???
   */
  return(
    <Flex 
      direction={"column"}
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack direction={"row"} spacing={"auto"}>
        <Stack 
          direction={"column"} 
          spacing={"auto"} 
          rounded={"2xl"}
          boxShadow={"2xl"}
        >
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
          <TableContainer>
            <Table size="lg">
              <Thead>
                <Th>
                  <Checkbox
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
        </Stack>
        <Divider orientation="vertical" mx={4} variant="solid" colorScheme="twitter"/>
        <FilterBox />
      </Stack>
    </Flex>
  );
}

export default TableComponent;