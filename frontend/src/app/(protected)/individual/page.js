'use client'
import {Center, Flex, Heading, HStack, Select, Stack} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import GamesTable from "@/components/GamesTable";
import PlayersTable from "@/components/PlayersTable";
import {useEffect, useState} from "react";
import {getRounds} from "@/app/api/getRounds";

export default function Page(){
    const [data, setData] = useState([])
    const [playerStats, setPlayerStats] = useState([])

    useEffect(() => {
        getRounds().then(rounds => {
            setData(rounds)
            setPlayerStats(rounds["player_stats"]["general"])
        });
    }, []);

    const handlePlayerSideSelect = (e) => {
        const side = e.target.value
        switch (side){
            case "atk":
                setPlayerStats(data["player_stats"]["atk"])
                break;
            case "def":
                setPlayerStats(data["player_stats"]["def"])
                break;
            case "general":
                setPlayerStats(data["player_stats"]["general"])
                break;
            default:
                setPlayerStats(data["player_stats"]["general"])
        }
    }

    return(
        <Center my={8} width={"inherit"}>
            <Flex flexDirection={"column"} gap={12}>
                <Flex justifyContent={"space-between"}>
                    <Heading>Individual Stats</Heading>
                    <HStack gap={8}>
                        <Select
                            rightIcon={<ChevronDownIcon/>}
                            placeholder={"Side"}
                            maxW={"fit-content"}
                            onClick={handlePlayerSideSelect}
                        >
                            <option value={"atk"}>ATK</option>
                            <option value={"def"}>DEF</option>
                            <option value={"general"}>ALL</option>
                        </Select>
                    </HStack>
                </Flex>
                <PlayersTable data={playerStats}/>
                <Stack direction={"column-reverse"}>
                    <Stack>1-10 of 50</Stack>
                </Stack>
            </Flex>
        </Center>
    )
}