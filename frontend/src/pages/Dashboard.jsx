import { useEffect, useState } from "react";
import { API } from "../api";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid gap-6 md:grid-cols-2">
      <div className="card">
        <h3 className="font-bold mb-2">📈 Stats</h3>
        <p>Total: {stats.total}</p>
        <p>Verified: {stats.verified}</p>
        <p>Tampered: {stats.tampered}</p>
      </div>

      <div className="card">
        <h3 className="font-bold mb-2">📊 Documents by Type</h3>
        <BarChart width={350} height={200} data={stats.byType}>
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </div>
    </div>
  );
}
