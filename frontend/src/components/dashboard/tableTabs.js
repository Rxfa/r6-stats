import { Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue } from '@chakra-ui/react';
import GameTableComponent from "./gameTable";


function TableTabsComponent(){
    return(
        <Tabs align='center' variant={"soft-rounded"} colorScheme={"blue"}>
            <TabList>
                <Tab>Games</Tab>
                <Tab>Rounds</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <GameTableComponent/>
                </TabPanel>
                <TabPanel>
                    <GameTableComponent/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TableTabsComponent;