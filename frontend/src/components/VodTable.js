import {
    IconButton, Link,
    Menu,
    MenuButton, MenuItem, MenuList,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import {EditIcon, ExternalLinkIcon} from "@chakra-ui/icons";

export default function VodTable({vods}){
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
                                    <Td>{new Date(vod.date).toLocaleDateString()}</Td>
                                    <Td>{vod.against}</Td>
                                    <Td>{vod.notes}</Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                aria-label={"Add"}
                                                rounded={'full'}
                                                cursor={'pointer'}
                                                icon={<EditIcon/>}
                                                isRound
                                                variant={"solid"}
                                            />
                                            <MenuList>
                                                <MenuItem>Edit</MenuItem>
                                                <MenuItem>Delete</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Td>
                                    <Td>
                                        <Link href={"#"} cursor={"pointer"} display={"contents"}>
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