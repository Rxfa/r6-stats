import { ThemeProvider } from "@emotion/react";
import theme from "../../themes/theme";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { DeleteAlertComponent } from "./delete";
import { ViewModalComponent } from "./view";
import { FilterBox } from "./filter";
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

function Dashboard(){
   return(
    <>
    </>
   ) 
}