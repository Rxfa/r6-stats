import {Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Link} from "@chakra-ui/react";
import {useRouter} from "next/navigation";

export default function GamesTable({games}){

    const router = useRouter()

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
                                        onClick={() => {
                                            router.push(`games/${game.match_id}`)
                                        }}
                                    >
                                        <Td>{new Date(game.date).toLocaleDateString()}</Td>
                                        <Td>{game.map}</Td>
                                        <Td>{game.score.own} - {game.score.opp}</Td>
                                        <Td>
                                            {game.bans.find(e => e.is_own).ATK} - {game.bans.find(e => e.is_own).DEF}
                                        </Td>
                                        <Td>
                                            {game.bans.find(e => e.is_own).ATK} - {game.bans.find(e => !(e.is_own)).DEF}
                                        </Td>
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