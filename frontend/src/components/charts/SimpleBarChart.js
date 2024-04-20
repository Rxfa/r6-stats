import {Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip} from "recharts";
import {Text} from "@chakra-ui/react";

export default function SimpleBarChart({data, dataKey, xAxisKey}){
    return(
        <ResponsiveContainer
            width={600}
            height={400}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <BarChart width={150} height={40} data={data}>
                <CartesianGrid strokeDasharray="10 10" />
                <XAxis dataKey={xAxisKey} />
                <YAxis type={"number"} domain={[0, 1]}/>
                <Tooltip />
                <Legend />
                <Bar
                    dataKey={dataKey}
                    fill="#8884d8"
                    activeBar={<Rectangle fill="#3B36A9" />}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}