import {
    IconButton, Link,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import {ExternalLinkIcon,} from "@chakra-ui/icons";
import { deleteVod} from "@/app/api/vods";
import { Button } from "@chakra-ui/react";

export default function VodTable({vods}){
    const handleVodDelete = (id) => {
        deleteVod(id).then(() => {
            
        })
    }

    return(
        <TableContainer>
            <Table size={"lg"}>
                <Thead>
                    <Tr>
                        <Th>Date</Th>
                        <Th>Against</Th>
                        <Th>Notes</Th>
                        <Th></Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        vods.map(
                            (vod) => (
                                <Tr key={vods.id}>
                                    <Td>{new Date(vod.upload_date).toLocaleDateString()}</Td>
                                    <Td>{vod.against}</Td>
                                    <Td>{vod.notes}</Td>
                                    <Td>
                                        <Button onClick={() =>handleVodDelete(vod.id)} colorScheme={"red"}>Delete</Button>
                                    </Td>
                                    <Td>
                                        <Link href={vod.url} cursor={"pointer"} display={"contents"}>
                                            <IconButton aria-label='Search database' icon={<ExternalLinkIcon />} />
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
