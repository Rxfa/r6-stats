import {Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Link} from "@chakra-ui/react";

export default function GamesTable({games}){
    return(
        <TableContainer>
            <Table size={"lg"}>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Map</Th>
                        <Th>Score</Th>
                        <Th>Our Bans</Th>
                        <Th>Their Bans</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        games.map(
                            (game) => (
                                <Link href={"#"} cursor={"pointer"} display={"contents"}>
                                    <Tr
                                        key={game.id}
                                        _hover={{
                                            bg: "lightblue"
                                        }}
                                    >
                                        <Td>{new Date(game.date).toLocaleDateString()}</Td>
                                        <Td>{game.map}</Td>
                                        <Td>{game.score.own} - {game.score.against}</Td>
                                        <Td>{game.bans.own.atk} - {game.bans.own.def}</Td>
                                        <Td>{game.bans.against.atk} - {game.bans.against.def}</Td>
                                    </Tr>
                                </Link>
                            )
                        )
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}