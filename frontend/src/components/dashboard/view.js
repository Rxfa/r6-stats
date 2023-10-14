import { useState, useRef, useEffect } from "react";
import { ChartData } from "./data";
import {
    AddIcon,
    ChevronDownIcon,
    DeleteIcon,
    ViewIcon
  } from '@chakra-ui/icons';
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

export function ViewModalComponent(games){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedMap, setSelectedMap] = useState([]);
    //const maps = useConst(() => 
    //  games.map(game => (game.map)).filter((val, idx, self) => (idx === self.indexOf(val)))
    //)
    return(
        <>
            <Button colorScheme="messenger" mr={6} variant={"outline"} maxWidth={"max-content"} onClick={onOpen}>
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
