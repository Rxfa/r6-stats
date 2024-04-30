'use client'
import {Box, Center, Divider, Flex, Heading, HStack, Select, SimpleGrid, Stack} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import GamesTable from "@/components/GamesTable";
import PlayersTable from "@/components/PlayersTable";
import {useEffect, useState} from "react";
import { getRounds } from "@/app/api/rounds";
import SimpleBarChart from "@/components/charts/SimpleBarChart";
import TwoBarChart from "@/components/charts/TwoBarsChart";

export default function Page(){
    const [playersData, setPlayersData] = useState({})
    const [plays, setPlays] = useState(0);
    const [wins, setWins] = useState(0);
    const [side, setSide] = useState("general")
    const [selectedMap, setSelectedMap] = useState("")
    const [playerStats, setPlayerStats] = useState([])
    const [teamStats, setTeamStats] = useState({})
    const [winRateData, setWinRateData] = useState([])
    const [playRateData, setPlayRateData] = useState([])

    useEffect(() => {
        getRounds().then(rounds => {
            setPlays(rounds.plays);
            setWins(rounds.wins);
            setPlayersData(rounds.player_stats);
            setPlayerStats(rounds.player_stats.general);
            setTeamStats(rounds.maps);
            setWinRateData(Object.entries(rounds.maps).map(
                ([map, value]) => (
                    {
                        name: map,
                        winrate: (value.team.general.sites.reduce((acc, site) => acc + site.wins, 0) / value.team.general.sites.reduce((acc, site) => acc + site.plays, 0)).toFixed(2)
                    }
                )
            ));
            setPlayRateData(Object.entries(rounds.maps).map(
                ([map, value]) => (
                    {
                        name: map,
                        playrate: (value.team.general.sites.reduce((acc, site) => acc + site.plays, 0) / rounds.plays).toFixed(2)
                    }
                )
            ))
            setSelectedMap(Object.keys(rounds.maps)[0]);
        });
        console.log(selectedMap);
    }, []);

    useEffect(() => {
        setPlayerStats(playersData.side)
        setWinRateData(Object.entries(teamStats).map(
            ([map, value]) => (
                {
                    name: map,
                    winrate: (value.team[side].sites.reduce((acc, site) => acc + site.wins, 0) / value.team[side].sites.reduce((acc, site) => acc + site.plays, 0)).toFixed(2)
                }
            )
        ))
        setPlayRateData(Object.entries(teamStats).map(
            ([map, value]) => (
                {
                    name: map,
                    playrate: (value.team[side].sites.reduce((acc, site) => acc + site.plays, 0) / plays).toFixed(2)
                }
            )
        ))
    }, [side])

    const handlePlayerSideSelect = (e) => {
        const side = e.target.value
        switch (side){
            case "atk":
                setSide("atk")
                setPlayerStats(playersData["atk"])
                break;
            case "def":
                setSide("def")
                setPlayerStats(playersData["def"])
                break;
            case "general":
                setSide("general")
                setPlayerStats(playersData["general"])
                break;
            default:
                setSide("general")
                setPlayerStats(playersData["general"])
        }
    }

    return(
        <Center my={8} width={"100%"}>
            <Stack gap={24}>
                <Flex flexDirection={"column"} gap={12}>
                    <Flex justifyContent={"space-between"}>
                        <Heading>Team Stats</Heading>
                        <HStack gap={8}>
                            <Select
                                rightIcon={<ChevronDownIcon/>}
                                placeholder={"Side"}
                                maxW={"fit-content"}
                                onChange={handlePlayerSideSelect}
                            >
                                <option value={"atk"}>ATK</option>
                                <option value={"def"}>DEF</option>
                                <option value={"general"}>ALL</option>
                            </Select>
                        </HStack>
                    </Flex>
                    <Divider/>
                    <SimpleGrid columns={2} spacing={10}>
                        <SimpleBarChart xAxisKey={"name"} dataKey={"winrate"} data={winRateData}/>
                        <SimpleBarChart xAxisKey={"name"} dataKey={"playrate"} data={playRateData}/>
                    </SimpleGrid>
                </Flex>
                <Flex gap={12} flexDirection={"column"}>
                    <Flex justifyContent={"space-between"}>
                        <Heading>Map Stats</Heading>
                        <HStack gap={8}>
                            <Select
                                rightIcon={<ChevronDownIcon/>}
                                placeholder={"Map"}
                                maxW={"fit-content"}
                                onChange={handlePlayerSideSelect}
                            >
                                {
                                    Object.keys(teamStats).map((map, index) => (
                                        <option key={index} value={map}>{map}</option>
                                    ))
                                }
                            </Select>
                        </HStack>
                    </Flex>
                    <Divider/>
                    <SimpleGrid columns={3} spacing={5}>
                        <Stack>
                            <Heading alignSelf={"center"}>General</Heading>
                            <TwoBarChart
                                xAxisKey={"site"}
                                dataKey={"plays"}
                                secondDataKey={"wins"}
                                data={teamStats[selectedMap]?.team.general.sites}
                            />
                        </Stack>
                        <Stack>
                            <Heading alignSelf={"center"}>ATK</Heading>
                            <TwoBarChart
                                xAxisKey={"site"}
                                dataKey={"plays"}
                                secondDataKey={"wins"}
                                data={teamStats[selectedMap]?.team.atk.sites}
                            />
                        </Stack>
                        <Stack>
                            <Heading alignSelf={"center"}>DEF</Heading>
                            <TwoBarChart

                                xAxisKey={"site"}
                                dataKey={"plays"}
                                secondDataKey={"wins"}
                                data={teamStats[selectedMap]?.team.def.sites}
                            />
                        </Stack>
                    </SimpleGrid>
                </Flex>
            </Stack>
        </Center>
    )
}
