import {Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Link, IconButton} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {ArrowForwardIcon, CloseIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {deleteGame} from "@/app/api/deleteGame";

export default function GamesTable({games}){

    const router = useRouter()

    const handleGameDelete = (id)=> {
        deleteGame(id).then(() => router.refresh())
    }

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
                        <Th>Delete</Th>
                        <Th>Game</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        games.map(
                            (game) => (
                                    <Tr
                                        key={game.id}
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
                                        <Td>
                                            <IconButton
                                                aria-label='Delete-game'
                                                icon={<CloseIcon />}
                                                onClick={() => handleGameDelete(game.match_id)}
                                            />
                                        </Td>
                                        <Td>
                                            <Link href={`games/${game.match_id}`} cursor={"pointer"} display={"contents"}>
                                                <IconButton aria-label='Game-detailed' icon={<ArrowForwardIcon />} />
                                            </Link>
                                        </Td>
                                    </Tr>
                            )
                        )
                    }
                </Tbody>
            </Table>
        </TableContainer>
    )
}