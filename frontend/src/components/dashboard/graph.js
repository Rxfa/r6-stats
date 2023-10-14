import theme from "../../themes/theme";
import { ThemeProvider } from "@mui/material";
import { Box } from "@mui/material";

/*
function randomInt(max){
    return Math.floor(Math.random() * max)
}

function createDummyData(names){
    let teamKills = 25 //TODO: Get this to be random numbers
    let teamDeaths = 20
    
    function giveKills(){
        let kills = randomInt(teamKills)
        teamKills -= kills
        return kills
    }

    function giveDeaths(){
        let deaths = randomInt(teamDeaths)
        teamKills -= deaths
        return deaths
    }

    names.map(name => {
        'name': name, 
        'kills': giveKills(),
        'deaths': giveDeaths(),
    })
}
*/

const Graph = ({}) => (
<ThemeProvider theme={theme}>

</ThemeProvider>
)

export default Graph;