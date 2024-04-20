import {Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export default function TwoBarChart({data, dataKey, secondDataKey, xAxisKey}){
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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey={dataKey}
                    fill="#8884d8"
                    activeBar={<Rectangle fill="#3B36A9" />}
                />
                <Bar
                    dataKey={secondDataKey}
                    fill="#82ca9d"
                    activeBar={<Rectangle fill="#398556" />}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}