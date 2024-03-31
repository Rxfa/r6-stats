import {useEffect, useState} from "react";
import {Flex, useColorModeValue} from "@chakra-ui/react";
import {RoundGeneralStats} from "../stats/RoundGeneralStats";


import {api} from "../../services/axiosConfig";
import {getRounds} from "../../services/rounds";


function RoundDashboardComponent(){

    const [rounds, setRounds] = useState({});

    useEffect(() => {
        getRounds()
            .then(res => setRounds(res.data))
            .catch(error => console.error(error));
    }, []);

    return(
        <Flex
            direction={"row"}
            bg={useColorModeValue('white', 'gray.800')}
            rounded={"2xl"}
            boxShadow={"2xl"}
        >
            {<RoundGeneralStats stats={rounds}/>}
        </Flex>
    );
}

export default RoundDashboardComponent;