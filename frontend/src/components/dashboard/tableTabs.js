import { Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from '@chakra-ui/react';
import TableComponent from "./table";


function TableTabsComponent(){
    return(
        <Tabs align='center' variant={"soft-rounded"} colorScheme={"blue"}>
            <TabList>
                <Tab>Games</Tab>
                <Tab>Rounds</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <TableComponent/>
                </TabPanel>
                <TabPanel>
                    <TableComponent/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TableTabsComponent;