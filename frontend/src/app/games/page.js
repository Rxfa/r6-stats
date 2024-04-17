'use client'
import {
    Button,
    Center,
    Flex,
    Heading, HStack, Select, Stack,
} from "@chakra-ui/react";
import GamesTable from "@/components/GamesTable";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {games} from "@/app/lib/games-placeholder";
import {useEffect, useState} from "react";

export default function Page(){
    const [data, setDate] = useState(games)
    const [maps, setMaps] = useState([])

    useEffect(() => {
        const uniqueMaps = Array.from(new Set(data.map(game => game.map)))
        setMaps(uniqueMaps)
    }, [data])

    return (
        <Center my={8} width={"inherit"}>
            <Flex flexDirection={"column"} gap={12}>
                <Flex justifyContent={"space-between"}>
                    <Heading>Games List</Heading>
                    <HStack gap={8}>
                        <Select rightIcon={<ChevronDownIcon/>} placeholder={"Map"} maxW={"fit-content"}>
                            {
                                maps.map(
                                    (m) => (
                                        <option value={m}>{m}</option>
                                    )
                                )
                            }
                        </Select>
                        <Select rightIcon={<ChevronDownIcon/>} placeholder={"Sort by"} maxW={"fit-content"}>
                            <option value={"date-desc"}>Date - Desc</option>
                            <option value={"date-asc"}>Date - Asc</option>
                            <option value={"map"}>Map - Desc</option>
                            <option value={"map"}>Map - Asc</option>
                            <option value={"score-own"}>Score - Own</option>
                            <option value={"score-opp"}>Score - Opp</option>
                        </Select>
                    </HStack>
                </Flex>
                <GamesTable games={games}/>
                <Stack direction={"column-reverse"}>
                    <Stack>1-10 of 50</Stack>
                </Stack>
            </Flex>
        </Center>
    )
}