import axios from "axios";
import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Stack,
    Select,
    Divider,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';

export function FilterBox(props){
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
         rounded={"2xl"}
         spacing={4}
         p={4}
         boxShadow={"2xl"}
         bg={useColorModeValue('gray.100', 'gray.800')}
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
          <HStack spacing={6}>
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
          <HStack spacing={6}>
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
          <Button colorScheme="messenger">Search </Button>
        </Stack>
      </Flex>
    )
}
