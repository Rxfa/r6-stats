import axios from "axios";
import {Flex, Stack, useColorModeValue,} from '@chakra-ui/react';
import TableTabsComponent from "./tableTabs";

function Dashboard(){
  const stackSpacing = 8;

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