import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

export default function TwoBarChart({data, dataKey, secondDataKey, xAxisKey}){
    return(
        <ResponsiveContainer
            width="100%"
            height={300}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis
                    dataKey={xAxisKey}
                    interval={0}
                />
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Legend verticalAlign="top"/>
                <Bar
                    dataKey={dataKey}
                    fill="#8884d8"
                />
                <Bar
                    dataKey={secondDataKey}
                    fill="#82ca9d"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}