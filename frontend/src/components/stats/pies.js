import { 
    Card,
    Stack,
    HStack,
    Text
} from "@chakra-ui/react";
import { 
    PieChart, 
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";
import { individualStats } from "../dashboard/data";

const customizedLabel = (entry) => entry.name

export function Pies(){
    const COLORS = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#9C1991"];

    return(
        <HStack 
        justify={"center"} 
        align={"center"} 
        textAlign={"center"}
        spacing={12}
        mt={12}
      >
        <Card variant={"filled"} rounded={"3xl"} p={4}>
            <Stack>
            <Text fontSize={"4xl"}>Kills</Text>
            <PieChart width={500} height={500}>
                <Legend />
                <Tooltip />
                <Pie 
                data={individualStats} 
                dataKey="kills" 
                dataName="name"
                label
                >
                {
                    individualStats
                    .map((value, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))
                }
                </Pie>
            </PieChart>
            </Stack>
        </Card>
        <Card variant={"filled"} rounded={"3xl"} p={4}>
            <Stack>
                <Text fontSize={"4xl"}>Deaths</Text>
                <PieChart width={500} height={500}>
                    <Legend />
                    <Tooltip />
                    <Pie 
                    data={individualStats} 
                    dataKey="deaths" 
                    dataName="name" 
                    label
                    >
                    {
                        individualStats
                        .map((value, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))
                    }
                    </Pie>
                </PieChart>
            </Stack>
        </Card>
      </HStack>
    );
}