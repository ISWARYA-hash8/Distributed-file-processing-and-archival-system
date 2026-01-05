import {
  LayoutDashboard,
  File,
  Clock,
  Archive,
  List
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, archived: 0 });
  const [recent, setRecent] = useState([]);
  const [typedText, setTypedText] = useState("");

  const fullText = "Welcome back to Archival System";

  // TYPEWRITER
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // FETCH FILES
  useEffect(() => {
    api.get("/files/all").then((res) => {
      const data = res.data || [];
      setStats({
        total: data.length,
        pending: data.filter(
          (f) => f.status === "PENDING" || f.status === "PROCESSING"
        ).length,
        archived: data.filter((f) => f.status === "ARCHIVED").length,
      });

      const sorted = data.slice().sort((a, b) => {
        const ta = new Date(a.uploadedAt || a.createdAt || 0).getTime();
        const tb = new Date(b.uploadedAt || b.createdAt || 0).getTime();
        return tb - ta;
      });

      setRecent(sorted.slice(0, 6));
    });
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          
          <span className="text-sm text-gray-500 dark:text-gray-300">
            Quick overview
          </span>
        </div>

        <p className="text-sm md:text-base font-medium text-blue-600 dark:text-blue-400">
          {typedText}
          <span className="animate-blink">|</span>
        </p>
      </div>

      {/* INFO CARD */}
      <div className="mb-6 p-4 rounded bg-white dark:bg-gray-800 shadow fade-slide">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          ArchivalSystem securely stores and indexes your files for long-term
          retention. Monitor uploads, processing, and archived files in real
          time.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card icon={<File />} title="Total Files" value={stats.total} />
        <Card
          icon={<Clock />}
          title="Processing"
          value={stats.pending}
          variant="yellow"
        />
        <Card
          icon={<Archive />}
          title="Archived"
          value={stats.archived}
          variant="green"
        />
      </div>

      {/* RECENT FILES – UPDATED */}
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <List /> Recent Files
          </h2>
          <span className="text-xs text-gray-500">Latest uploads</span>
        </div>

        {recent.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300">
            No recent files uploaded
          </p>
        )}

        <div className="grid gap-3">
          {recent.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-blue-100 text-blue-600">
                  <File size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-gray-100">
                    {f.fileName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(f.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              {/* STATUS PILL */}
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium
                ${
                  f.status === "ARCHIVED"
                    ? "bg-green-100 text-green-700"
                    : f.status === "PROCESSING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* CARD */
const Card = ({ title, value, icon, variant }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex items-center gap-4 hover-scale">
    <div
      className={`p-3 rounded-md ${
        variant === "green"
          ? "bg-green-100 text-green-700"
          : variant === "yellow"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
