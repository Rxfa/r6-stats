'use client'
import {Center, Divider, Flex, Heading, HStack, Select, SimpleGrid, Stack} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import PlayersTable from "@/components/PlayersTable";
import {useEffect, useState} from "react";
import {getRounds} from "@/app/api/getRounds";
import TwoBarChart from "@/components/charts/TwoBarsChart";
import SimpleScatterChart from "@/components/charts/SimpleScatterChart";
import SimpleBarChart from "@/components/charts/SimpleBarChart";

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
                <Stack mt={12} spacing={12}>
                    <>
                        <Heading alignSelf={"center"}>Openings</Heading>
                        <Divider my={6}/>
                        <SimpleGrid columns={3} spacingY={12}>
                            <Stack>
                                <Heading alignSelf={"center"}>General</Heading>
                                <TwoBarChart
                                    xAxisKey={"name"}
                                    dataKey={"opening_kills"}
                                    secondDataKey={"opening_deaths"}
                                    data={data?.player_stats?.general}
                                />
                            </Stack>
                            <Stack>
                                <Heading alignSelf={"center"}>ATK</Heading>
                                <TwoBarChart
                                    xAxisKey={"name"}
                                    dataKey={"opening_kills"}
                                    secondDataKey={"opening_deaths"}
                                    data={data?.player_stats?.atk}
                                />
                            </Stack>
                            <Stack>
                                <Heading alignSelf={"center"}>DEF</Heading>
                                <TwoBarChart
                                    xAxisKey={"name"}
                                    dataKey={"opening_kills"}
                                    secondDataKey={"opening_deaths"}
                                    data={data?.player_stats?.def}
                                />
                            </Stack>
                        </SimpleGrid>
                    </>
                    <>
                        <Heading alignSelf={"center"}>Entries</Heading>
                        <Divider my={6}/>
                        <SimpleGrid columns={3} spacingY={12}>
                            <Stack>
                                <Heading alignSelf={"center"}>General</Heading>
                                <TwoBarChart
                                    xAxisKey={"name"}
                                    dataKey={"entry_kills"}
                                    secondDataKey={"entry_deaths"}
                                    data={data?.player_stats?.general}
                                />
                            </Stack>
                            <Stack>
                                <Heading alignSelf={"center"}>ATK</Heading>
                                <TwoBarChart
                                    xAxisKey={"name"}
                                    dataKey={"entry_kills"}
                                    secondDataKey={"entry_deaths"}
                                    data={data?.player_stats?.atk}
                                />
                            </Stack>
                            <Stack>
                                <Heading alignSelf={"center"}>DEF</Heading>
                                <TwoBarChart
                                    xAxisKey={"name"}
                                    dataKey={"entry_kills"}
                                    secondDataKey={"entry_deaths"}
                                    data={data?.player_stats?.def}
                                />
                            </Stack>
                        </SimpleGrid>
                    </>
                    <>
                        <Heading alignSelf={"center"}>KPR</Heading>
                        <Divider my={6}/>
                        <SimpleGrid columns={3} spacingY={12}>
                            <Stack>
                                <Heading alignSelf={"center"}>General</Heading>
                                <SimpleBarChart
                                    data={data?.player_stats?.general}
                                    dataKey={"kpr"}
                                    xAxisKey={"name"}
                                />
                            </Stack>
                            <Stack>
                                <Heading alignSelf={"center"}>ATK</Heading>
                                <SimpleBarChart
                                    data={data?.player_stats?.atk}
                                    dataKey={"kpr"}
                                    xAxisKey={"name"}
                                />
                            </Stack>
                            <Stack>
                                <Heading alignSelf={"center"}>DEF</Heading>
                                <SimpleBarChart
                                    data={data?.player_stats?.def}
                                    dataKey={"kpr"}
                                    xAxisKey={"name"}
                                />
                            </Stack>
                        </SimpleGrid>
                    </>
                    <>
                        <Heading alignSelf={"center"}>Objective Plays</Heading>
                        <Divider my={6}/>
                        <SimpleGrid columns={2} spacingY={12}>
                            <Stack mx={"auto"} gap={6}>
                                <Heading alignSelf={"center"}>PLANTS</Heading>
                                <SimpleBarChart
                                    data={data?.player_stats?.general}
                                    dataKey={"plants"}
                                    xAxisKey={"name"}
                                />
                            </Stack>
                            <Stack mx={"auto"} gap={6}>
                                <Heading alignSelf={"center"}>DISABLES</Heading>
                                <SimpleBarChart
                                    data={data?.player_stats?.general}
                                    dataKey={"disables"}
                                    xAxisKey={"name"}
                                />
                            </Stack>
                        </SimpleGrid>
                    </>
                </Stack>
            </Flex>
        </Center>
    )
}