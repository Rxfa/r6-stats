import { ThemeProvider } from "@emotion/react";
import theme from "../themes/theme";
import "../App.css";
import { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Checkbox,
  IconButton,
  Flex,
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
  Stack,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

import {
  AddIcon,
  DeleteIcon,
  ViewIcon
} from '@chakra-ui/icons';


function createData(id, date, map, score, own_atk_ban, own_def_ban, opp_atk_ban, opp_def_ban) {
    return { id, date, map, score, own_atk_ban, own_def_ban, opp_atk_ban, opp_def_ban };
  }

const rows = [
  createData(1, "01/09/2023", "Club", "6-6", "Thatcher", "Azami", "Hibana", "Fenrir"),
  createData(2, "02/09/2023", "Oregon", "10-2", "Ying", "Solis", "Flores", "Valkyrie"),
  createData(3, "03/09/2023", "Kafe", "4-8", "Montagne", "Azami", "Thatcher", "Mira"),
  createData(4, "03/09/2023", "Chalet", "11-0", "Osa", "Fenrir", "Capitao", "Azami"),
  createData(5, "05/09/2023", "Club", "7-5", "Thatcher", "Bandit", "Flores", "Valkyrie"),
  createData(6, "05/09/2023", "Oregon", "4-8", "Thatcher", "Bandit", "Flores", "Valkyrie"),
  createData(7, "05/09/2023", "Club", "9-3", "Thatcher", "Bandit", "Flores", "Valkyrie"),
  createData(8, "05/09/2023", "Skyscraper", "11-0", "Flores", "Mira", "Thermite", "Valkyrie"),
  createData(9, "05/09/2023", "Nighthaven", "5-7", "Hibana", "Fenrir", "Thatcher", "Azami"),
  createData(10, "05/09/2023", "Consulate", "2-10", "Ying", "Solis", "Thatcher", "Azami"),
  createData(11, "05/09/2023", "Border", "0-11", "Ying", "Fenrir", "Flores", "Valkyrie"),
];

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

function ViewModalComponent(){
  const { isOpen, onOpen, onClose } = useDisclosure()
  return(
      <>
          <Button colorScheme="messenger" mr={6} leftIcon={<ViewIcon />} maxWidth={"max-content"} onClick={onOpen}>
              View
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>Stats</ModalHeader>
                  <ModalCloseButton />
                  <Tabs>
                      <TabList>
                          <Tab>General</Tab>
                          <Tab>Rounds</Tab>
                          <Tab>Individual</Tab>
                      </TabList>
                  </Tabs>
                  <ModalBody>
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

function TableComponent() {
  const [checkedGamesIds, setcheckedGamesIds] = useState([]);

  return(
    <Flex direction={"column"}>
      <Stack direction={"row-reverse"} spacing={"auto"} mx={"6"}>
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
        <Table size="lg" variant="striped" colorScheme="messenger">
          <TableCaption>Games</TableCaption>
          <Thead>
            <Th>
              <Checkbox
              isChecked={checkedGamesIds.length === rows.map(row => row.id).length}
              onChange={() => {
                const gameIds = rows.map(row => row.id)
                if (checkedGamesIds.length === gameIds.length){
                  setcheckedGamesIds([])
                } else {
                  setcheckedGamesIds(gameIds)
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
              rows.map(row => (
                <Tr>
                  <Td>
                    <Checkbox
                    isChecked={
                      checkedGamesIds.includes(row.id)
                    }
                    onChange={() => {
                      console.log(checkedGamesIds)
                      const idx = checkedGamesIds.indexOf(row.id)
                      if(idx > -1){
                        setcheckedGamesIds([...checkedGamesIds.slice(0, idx), ...checkedGamesIds.slice(idx+1)])
                      } else {
                        setcheckedGamesIds([...checkedGamesIds, row.id])
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
    </Flex>
  );
}

export default TableComponent;