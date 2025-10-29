import React, { useState, useEffect } from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartDataPoint = {
  name: string;
  Completed: number;
  "In Progress": number;
};

type BarChartProps = {
  data: ChartDataPoint[];
  colors?: string[];
  title?: string;
};

const BarChart: React.FC<BarChartProps> = ({ data, colors = ["#a5b4fc", "#fde68a"] }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const listener = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  const chartWidth = isMobile ? data.length * 60 : "100%";

  return (
    <div style={{ width: "100%", height: 320, overflowX: isMobile ? "auto" : "visible" }}>
      <ResponsiveContainer width={chartWidth} height="100%">
        <ReBarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 80 : 40}
          />
          <YAxis />
          <Tooltip />
          <Legend wrapperStyle={{ paddingBottom: 15 }} />
          <Bar dataKey="Completed" fill={colors[0]} radius={[6, 6, 0, 0]} />
          <Bar dataKey="In Progress" fill={colors[1]} radius={[6, 6, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
