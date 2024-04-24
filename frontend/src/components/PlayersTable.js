import {useRouter} from "next/navigation";
import {IconButton, Link, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {ExternalLinkIcon} from "@chakra-ui/icons";

export default function PlayersTable({data}){

    return(
        <TableContainer>
            <Table size={"lg"}>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Rounds</Th>
                        <Th>Kills</Th>
                        <Th>Deaths</Th>
                        <Th>Assists</Th>
                        <Th>HS%</Th>
                        <Th>KOST</Th>
                        <Th>Multikills</Th>
                        <Th>SRV</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        data.map(
                            (player) => (
                                <Tr
                                    key={player.name}
                                >
                                    <Td>{player.name}</Td>
                                    <Td isNumeric>{player.rounds}</Td>
                                    <Td isNumeric>{player.kills}</Td>
                                    <Td isNumeric>{player.deaths}</Td>
                                    <Td isNumeric>{player.assists}</Td>
                                    <Td>{player.hs_percentage}</Td>
                                    <Td>{player.kost}</Td>
                                    <Td isNumeric>{player.multikills}</Td>
                                    <Td>{player.survival_rate}</Td>
                                </Tr>
                            )
                        )
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}