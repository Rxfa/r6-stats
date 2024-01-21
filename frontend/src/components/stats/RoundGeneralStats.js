import {Box, Divider, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

function RoundGeneralStatsRow(props){
    return(
        <Tr>
            <Td>{props.player.name}</Td>
            <Td>{props.player.rounds}</Td>
            <Td>{props.player.kills}</Td>
            <Td>{props.player.deaths}</Td>
            <Td>{props.player.kd_ratio}</Td>
            <Td>{props.player.assists}</Td>
            <Td>{props.player.hs_percentage}</Td>
            <Td>{props.player.kost}</Td>
            <Td>{props.player.plants}</Td>
            <Td>{props.player.disables}</Td>
            <Td>{props.player.multikills}</Td>
            <Td>{props.player.survival_rate}</Td>
        </Tr>
    );
}

function RoundGeneralStatsTable(props){
    return(
        <Table>
            <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Rounds</Th>
                    <Th>Kills</Th>
                    <Th>Deaths</Th>
                    <Th>KD</Th>
                    <Th>Assists</Th>
                    <Th>HS%</Th>
                    <Th>KOST</Th>
                    <Th>Plants</Th>
                    <Th>Disables</Th>
                    <Th>Multikills</Th>
                    <Th>SRV</Th>
                </Tr>
            </Thead>
            <Tbody>
                {props.players?.map(player => <RoundGeneralStatsRow player={player}/>)}
            </Tbody>
        </Table>
    );
}

export function RoundGeneralStats(props){
    return(
        <Box justifyContent={"center"} alignItems={"center"}>
            <h1>Players Stats - General</h1>
            <Divider my={5}/>
            <RoundGeneralStatsTable players={props.stats.player_stats?.general}/>
        </Box>
    );
}