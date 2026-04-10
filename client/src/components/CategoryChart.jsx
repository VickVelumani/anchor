import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function CategoryChart({ urges }) {
  const categoryCounts = {};

  urges.forEach((urge) => {
    const category = urge.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const data = Object.keys(categoryCounts).map((category) => ({
    name: category,
    value: categoryCounts[category],
  }));

  const COLORS = [
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#4ade80",
    "#86efac",
    "#14532d",
  ];

  return (
    <div className="chart-card">
      <div className="section-header">
        <h2>Urges by Category</h2>
        <p className="section-subtext">
          See which types of urges show up most often.
        </p>
      </div>

      <div className="chart-wrapper">
        {data.length === 0 ? (
          <p className="empty-chart-text">No urge data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111713",
                  border: "1px solid #2a352d",
                  borderRadius: "10px",
                  color: "#f0fdf4",
                }}
                labelStyle={{ color: "#f0fdf4" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default CategoryChart;