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
  import { useState, useRef, useEffect } from "react";

  import {
    AddIcon,
    ChevronDownIcon,
    DeleteIcon,
    ViewIcon
  } from '@chakra-ui/icons';

export function DeleteAlertComponent() {
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