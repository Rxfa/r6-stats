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
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import {getGames} from "@/app/api/getGames";

export default function Page(){
    const [data, setData] = useState([])
    const [shownData, setShownData] = useState([])
    const [maps, setMaps] = useState([])
    const [plays, setPlays] = useState([])

    useEffect(() => {
        getGames().then(games => {
            setData(games)
            setShownData(games)
        });
    }, []);

    useEffect(() => {
        const uniqueMaps = Array.from(new Set(data.map(game => game.map)))
        setMaps(uniqueMaps)
    }, [data])

    const handleMapSelect = (e) => {
        const map = e.target.value
        if(maps.includes(map)){
            setShownData(data.filter(game => game.map === map))
        } else {
            setShownData(data)
        }
    }

    const handleMapSort = (e) => {
        const sort = e.target.value
        switch (sort){
            case "date-desc":
                setShownData(shownData.sort((a, b) => new Date(b.date) - new Date(a.date)))
                break;
            case "date-asc":
                setShownData(shownData.sort((a, b) => new Date(a.date) - new Date(b.date)))
                break;
            case "map":
                setShownData(shownData.sort((a, b) => a.map.localeCompare(b.map)))
                break;
            case "score-own":
                setShownData(shownData.sort((a, b) => a.score.own - b.score.opp))
                break;
            case "score-opp":
                setShownData(shownData.sort((a, b) => a.score.opp - b.score.own))
                break;
            default:
                break;
        }
    }

    return (
        <Center my={8} width={"inherit"}>
            <Flex flexDirection={"column"} gap={12}>
                <Flex justifyContent={"space-between"}>
                    <Heading>Games List</Heading>
                    <HStack gap={8}>
                        <Select
                            rightIcon={<ChevronDownIcon/>}
                            placeholder={"Map"}
                            maxW={"fit-content"}
                            onClick={handleMapSelect}
                        >
                            {
                                maps.map(
                                    (m) => (
                                        <option value={m}>{m}</option>
                                    )
                                )
                            }
                        </Select>
                        <Select
                            rightIcon={<ChevronDownIcon/>}
                            placeholder={"Sort by"}
                            maxW={"fit-content"}
                            onChange={handleMapSort}
                        >
                            <option value={"date-desc"}>Date - Desc</option>
                            <option value={"date-asc"}>Date - Asc</option>
                            <option value={"map"}>Map - Desc</option>
                            <option value={"map"}>Map - Asc</option>
                            <option value={"score-own"}>Score - Own</option>
                            <option value={"score-opp"}>Score - Opp</option>
                        </Select>
                    </HStack>
                </Flex>
                <GamesTable games={shownData}/>
            </Flex>
        </Center>
    )
}