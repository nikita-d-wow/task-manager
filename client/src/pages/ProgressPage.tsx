import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import BarChart from "../components/Charts/BarChart";
import LineChart from "../components/Charts/LineChart";
import ChartWrapper from "../components/Charts/ChartWrapper";
import { DAYS, MONTHS } from "../constants/timeConstants";
import type { ProgressStats, OverallProgress } from "../types/type.progress";

const ProgressPage: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<ProgressStats[]>([]);
  const [monthlyData, setMonthlyData] = useState<ProgressStats[]>([]);
  const [overall, setOverall] = useState<OverallProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [weeklyRes, monthlyRes, overallRes] = await Promise.all([
          axiosInstance.get("/weekly"),
          axiosInstance.get("/monthly"),
          axiosInstance.get("/overall"),
        ]);
        setWeeklyData(weeklyRes.data || []);
        setMonthlyData(monthlyRes.data || []);
        setOverall(overallRes.data || null);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError("Failed to fetch progress data");
      } finally {
        setLoading(false);
      }
    };
    fetchProgressData();
  }, []);

  // Map and order days/months, filling missing values with 0
  const weeklyChartData = DAYS.map((day) => {
    const entry = weeklyData.find((w) => w.day === day);
    return {
      name: day,
      Completed: entry ? entry.completedTasks : 0,
      "In Progress": entry ? entry.inProgress : 0,
    };
  });

  const monthlyChartData = MONTHS.map((month) => {
    const entry = monthlyData.find((m) => m.month === month);
    return {
      name: month,
      Completed: entry ? entry.completedTasks : 0,
      "In Progress": entry ? entry.inProgress : 0,
    };
  });

  const chartColors = ["#a5b4fc", "#fde68a", "#bbf7d0", "#fbcfe8"];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-center mb-6">📊 Task Progress Overview</h1>
      {loading && <p className="text-gray-500 text-center">Loading progress data...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <>
          {overall && (
            <div className="bg-blue-50 text-blue-700 rounded-xl p-4 text-center mb-8 shadow-sm">
              <p className="font-semibold sm:text-lg text-base">
                Total Tasks: {overall.totalTasks} | Completed: {overall.completedTasks} | Overall Progress:{" "}
                {overall.overallProgress.toFixed(1)}%
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartWrapper title="Weekly Progress">
              <BarChart data={weeklyChartData} title="Weekly Progress" colors={chartColors} />
            </ChartWrapper>

            <ChartWrapper title="Monthly Progress" className="min-h-[440px] md:min-h-[430px]">
              <LineChart data={monthlyChartData} title="Monthly Progress" colors={chartColors} />
            </ChartWrapper>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPage;
