import { 
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
 } from "@chakra-ui/react";
import { individualStats } from "../dashboard/data";

export function StatsTable(){
    return(
        <Table variant="simple">
        <Thead>
            <Tr>
                <Th>Name</Th>
                <Th>Rating</Th>
                <Th>Rounds</Th>
                <Th>Kills</Th>
                <Th>Deaths</Th>
                <Th>KD Diff</Th>
                <Th>KD Ratio</Th>
                <Th>KPR</Th>
                <Th>HS%</Th>
                <Th>Entry Kills</Th>
                <Th>Entry Deaths</Th>
                <Th>Entry Diff</Th>
                <Th>1vX</Th>
                <Th>Multikills</Th>
                <Th>Plants</Th>
                <Th>Disables</Th>
                <Th>Kost</Th>
                <Th>SRV</Th>
            </Tr>
        </Thead>
        <Tbody>
          {
            individualStats.map(row => (
              <Tr>
                <Td>{row.name}</Td>
                <Td>{row.rating}</Td>
                <Td>{row.rounds}</Td>
                <Td>{row.kills}</Td>
                <Td>{row.deaths}</Td>
                <Td color={(row.kd_diff > 0) ? "green.500" : "red.500"}>
                  {(row.kd_diff > 0) ? "+" : "-"}{row.kd_diff}
                </Td>
                <Td>{row.kd_ratio}</Td>
                <Td>{row.kpr}</Td>
                <Td>{row.hs_percentage}</Td>
                <Td>{row.entry_kills}</Td>
                <Td>{row.entry_deaths}</Td>
                <Td color={(row.kd_diff >= 0) ? "green.500" : "red.500"}>
                {(row.entry_diff >= 0) ? "+" : "-"}{row.entry_diff}
                </Td>
                <Td>{row.clutches}</Td>
                <Td>{row.multikills}</Td>
                <Td>{row.plants}</Td>
                <Td>{row.disables}</Td>
                <Td>{row.kost}</Td>
                <Td>{row.srv}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    );
}