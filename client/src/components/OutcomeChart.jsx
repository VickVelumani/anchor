import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function OutcomeChart({ resistedCount, gaveInCount }) {
  const data = [
    { name: "Resisted", count: resistedCount },
    { name: "Gave In", count: gaveInCount },
  ];

  return (
    <div className="chart-card">
      <div className="section-header">
        <h2>Outcome Overview</h2>
        <p className="section-subtext">A quick view of resisted urges vs urges you gave in to.</p>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#243127" />
            <XAxis dataKey="name" stroke="#b7cbbd" />
            <YAxis stroke="#b7cbbd" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111713",
                border: "1px solid #2a352d",
                borderRadius: "10px",
                color: "#f0fdf4",
              }}
              labelStyle={{ color: "#f0fdf4" }}
            />
            <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OutcomeChart;