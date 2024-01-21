import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react';
import GameTableComponent from "./gameTable";
import RoundDashboardComponent from "./roundDashboard";


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
                    <RoundDashboardComponent/>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TableTabsComponent;