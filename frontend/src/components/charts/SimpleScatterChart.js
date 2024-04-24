import {
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis
} from "recharts";

export default function SimpleScatterChart({data, data2, dataKey, secondDataKey, thirdDataKey}) {
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
            <ScatterChart
                width={500}
                height={300}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid />
                <XAxis
                    dataKey={dataKey}
                    allowDecimals={false}
                    type={"number"}
                />
                <YAxis
                    dataKey={secondDataKey}
                    allowDecimals={false}
                    domain={[0, 'dataMax']}
                    type={"number"}
                />
                <ZAxis
                    dataKey={thirdDataKey}
                    type="string"
                    name="username"
                />
                <Tooltip />
                <Scatter
                    data={data}
                    name={"ATK"}
                    fill="#82ca9d"
                />
            </ScatterChart>
        </ResponsiveContainer>
    )
}
