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
import TableComponent from "./table";

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
      flexGrow={1}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.200', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Stack direction={"row"} spacing={"auto"}>
        <Stack 
          direction={"column"} 
          spacing={"auto"} 
          rounded={"2xl"}
          boxShadow={"2xl"}
        >
        <TableComponent/>
        </Stack>
        <Divider orientation="vertical" mx={4} variant="solid" colorScheme="twitter"/>
        <FilterBox />
      </Stack>
    </Flex>
   ) 
}

export default Dashboard;