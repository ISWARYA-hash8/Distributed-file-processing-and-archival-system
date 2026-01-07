import { useEffect, useState } from "react";
import axios from "../api/api";
import { getToken } from "../utils/auth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FileText } from "lucide-react";

export default function ArchivedFilesPage() {
  const [archivedFiles, setArchivedFiles] = useState([]);

  useEffect(() => {
    fetchArchivedFiles();
  }, []);

  const fetchArchivedFiles = async () => {
    const token = getToken();
    if (!token || token.split(".").length !== 3) {
      console.error("No valid JWT found. Please login again.");
      return;
    }

    try {
      const res = await axios.get("/files/archived");
      setArchivedFiles(res.data || []);
    } catch (err) {
      console.error("Error fetching archived files:", err);
    }
  };

  /* ---------- GRAPH DATA ---------- */

  const grouped = archivedFiles.reduce((acc, file) => {
    const date = file.archivedAt ? file.archivedAt.split("T")[0] : null;
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const allDatesSorted = (() => {
    const keys = Object.keys(grouped).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    if (keys.length === 0) return [];
    const start = new Date(keys[0]);
    const end = new Date(keys[keys.length - 1]);
    const out = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      out.push(d.toISOString().split("T")[0]);
    }
    return out;
  })();

  let cumulative = 0;
  const chartData = allDatesSorted.map((d) => {
    const dayCount = grouped[d] || 0;
    cumulative += dayCount;
    return { date: d, count: dayCount, cumulative };
  });

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const tickInterval =
    chartData.length > 14 ? Math.ceil(chartData.length / 7) : "preserveStartEnd";

  /* ---------- UI ---------- */

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Archived Files</h1>

      {/* GRAPH */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8 h-72">
        <h2 className="font-semibold mb-3">Archived Files Over Time</h2>

        {chartData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">
            No archived data yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.08} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e6edf3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={formatDate}
                interval={tickInterval}
                axisLine={false}
                tickLine={false}
              />
              <YAxis allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 6 }} />

              {/* 🔥 FIX: shows line even for single data point */}
              <Area
                type="monotone"
                dataKey="count"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="url(#grad)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  File Name
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Size (KB)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Archived At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {archivedFiles.map((file) => (
                <tr
                  key={file.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    <span className="truncate">{file.fileName}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(file.size / 1024).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {file.archivedAt
                      ? new Date(file.archivedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {archivedFiles.length === 0 && (
          <p className="p-4 text-gray-500 dark:text-gray-300">
            No archived files
          </p>
        )}
      </div>
    </div>
  );
}
