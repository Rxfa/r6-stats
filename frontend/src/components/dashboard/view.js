import { useState } from "react";
import { ChevronDownIcon } from '@chakra-ui/icons';
  import {
    Bar,
    BarChart,
    PieChart,
    Pie,
    ResponsiveContainer,
    Cell,
    LabelList
  } from "recharts";
import { StatsTable } from "../stats/statsTable";
import { individualStats } from "./data";  
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
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
    useDisclosure,
    Button,
    Divider,
    Text,
    HStack,
    Stack
  } from '@chakra-ui/react';
import { Pies } from "../stats/pies";

export function ViewModalComponent(games){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedMap, setSelectedMap] = useState([]);

    return(
        <>
            <Button colorScheme="messenger" mr={6} variant={"outline"} maxWidth={"max-content"} onClick={onOpen}>
              View
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" size="full">
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
                                <TabPanel id="general">
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
                                  {
                                  /*
                                  <ResponsiveContainer maxWidth="100%" maxHeight="100%">
                                      <BarChart width={140} height={40} data={ChartData(games, selectedMap)}>
                                        {
                                          
                                            <Bar dataKey={}/>
                                           
                                        }
                                      </BarChart>
                                  </ResponsiveContainer>
                                  */}
                                </TabPanel>
                                {
                                  //games.length === 1 &&
                                  <TabPanel id="individual">
                                    <StatsTable />
                                    <Pies />
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
