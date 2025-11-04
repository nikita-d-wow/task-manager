import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../lib/axiosInstance";
import BarChart from "../components/Charts/BarChart";
import LineChart from "../components/Charts/LineChart";
import ChartWrapper from "../components/Charts/ChartWrapper";
import { DAYS, MONTHS } from "../constants/timeConstants";
import type { ProgressStats, OverallProgress } from "../types/type.progress";
import { motion } from "framer-motion";

const pastelColors = ["#bbf7d0", "#fbcfe8", "#93c5fd", "#fcd34d"]; // pastel colors

const ProgressPage: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState<ProgressStats[]>([]);
  const [monthlyData, setMonthlyData] = useState<ProgressStats[]>([]);
  const [overall, setOverall] = useState<OverallProgress | null>(null);

  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingOverall, setLoadingOverall] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeekly = axiosInstance
      .get("/weekly")
      .then((res) => setWeeklyData(res.data || []))
      .catch((err) => {
        console.error("Error fetching weekly data:", err);
        setError("Failed to fetch weekly progress data");
      })
      .finally(() => setLoadingWeekly(false));

    const fetchMonthly = axiosInstance
      .get("/monthly")
      .then((res) => setMonthlyData(res.data || []))
      .catch((err) => {
        console.error("Error fetching monthly data:", err);
        setError("Failed to fetch monthly progress data");
      })
      .finally(() => setLoadingMonthly(false));

    const fetchOverall = axiosInstance
      .get("/overall")
      .then((res) => setOverall(res.data || null))
      .catch((err) => {
        console.error("Error fetching overall data:", err);
        setError("Failed to fetch overall progress data");
      })
      .finally(() => setLoadingOverall(false));

    Promise.all([fetchWeekly, fetchMonthly, fetchOverall]);
  }, []);

  const weeklyChartData = useMemo(
    () =>
      DAYS.map((day) => {
        const entry = weeklyData.find((w) => w.day === day);
        return {
          name: day,
          Completed: entry ? entry.completedTasks : 0,
          "In Progress": entry ? entry.inProgress : 0,
        };
      }),
    [weeklyData]
  );

  const monthlyChartData = useMemo(
    () =>
      MONTHS.map((month) => {
        const entry = monthlyData.find((m) => m.month === month);
        return {
          name: month,
          Completed: entry ? entry.completedTasks : 0,
          "In Progress": entry ? entry.inProgress : 0,
        };
      }),
    [monthlyData]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-md mt-6"
    >
      <h1
        className="text-2xl font-bold text-center mb-6 text-gray-800 select-none"
        role="heading"
        aria-level={1}
      >
        📊 Task Progress Overview
      </h1>

      {error && <p className="text-red-500 text-center" role="alert">{error}</p>}

      {overall && !loadingOverall ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 text-blue-700 rounded-xl p-4 text-center mb-8 shadow-sm"
          role="region"
          aria-label={`Total tasks: ${overall.totalTasks}, Completed: ${overall.completedTasks}, Overall progress: ${overall.overallProgress.toFixed(1)} percent`}
        >
          <p className="font-semibold sm:text-lg text-base select-text">
            Total Tasks: {overall.totalTasks} | Completed: {overall.completedTasks} | Overall Progress:{" "}
            {overall.overallProgress.toFixed(1)}%
          </p>
        </motion.div>
      ) : loadingOverall ? (
        <p className="text-gray-500 text-center">Loading overall progress...</p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="region" aria-label="Progress charts">
        <ChartWrapper title="Weekly Progress" className="min-h-[450px]">
          {loadingWeekly ? (
            <p className="text-gray-500 text-center mt-20">Loading weekly progress...</p>
          ) : (
            <BarChart data={weeklyChartData} title="Weekly Progress" colors={pastelColors} />
          )}
        </ChartWrapper>

        <ChartWrapper title="Monthly Progress" className="min-h-[450px]">
          {loadingMonthly ? (
            <p className="text-gray-500 text-center mt-20">Loading monthly progress...</p>
          ) : (
            <LineChart data={monthlyChartData} title="Monthly Progress" colors={pastelColors} />
          )}
        </ChartWrapper>
      </div>
    </motion.div>
  );
};

export default ProgressPage;
