import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Same pastels as BarChart for color consistency
const pastelColors = ["#a5b4fc", "#fde68a", "#bbf7d0", "#fbcfe8"];

type LineChartProps = {
  data: { name: string; Completed: number; "In Progress": number }[];
  title: string;
  colors?: string[];
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  colors = pastelColors,
}) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <ReLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Completed" stroke={colors[0]} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="In Progress" stroke={colors[1]} strokeWidth={3} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
