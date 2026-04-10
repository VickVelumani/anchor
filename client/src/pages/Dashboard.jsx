import CategoryChart from "../components/CategoryChart";
import OutcomeChart from "../components/OutcomeChart";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [urges, setUrges] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let errorMessages = [];

      try {
        const statsRes = await API.get("/stats/summary");
        setStats(statsRes.data);
      } catch (err) {
        console.error("STATS ERROR:", err);
        errorMessages.push("Failed to load stats");
      }

      try {
        const urgesRes = await API.get("/urges");
        setUrges(Array.isArray(urgesRes.data) ? urgesRes.data : []);
      } catch (err) {
        console.error("URGES ERROR:", err);
        errorMessages.push("Failed to load urges");
      }

      if (errorMessages.length > 0) {
        setError(errorMessages.join(" | "));
      }
    };

    fetchData();
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "No date available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString();
  }

  function getOutcomeBadgeClass(outcome) {
    if (outcome === "resisted") return "badge success";
    if (outcome === "gave_in") return "badge danger";
    return "badge neutral";
  }

  function getIntensityClass(intensity) {
    if (intensity >= 8) return "intensity high";
    if (intensity >= 5) return "intensity medium";
    return "intensity low";
  }

  const pendingUrges = urges.filter((u) => !u.outcome);
  const completedUrges = urges.filter((u) => u.outcome);

  return (
    <AppLayout>
      <section className="dashboard-header">
        <div>
          <h1>My Dashboard</h1>
          <p>Track your urges and stay in control.</p>
        </div>

        <div className="dashboard-actions">
          <Link to="/log-urge" className="primary-btn">
            + Log Urge
          </Link>

          <Link to="/my-urges" className="secondary-btn">
            My Urges
          </Link>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      {stats && (
        <section className="stats-grid">
          <StatCard label="Success Rate" value={`${stats.success_rate}%`} />
          <StatCard label="Current Streak" value={stats.current_streak} />
          <StatCard label="Total Urges" value={stats.total_urges} />
          <StatCard label="Resisted" value={stats.resisted_count} />
          <StatCard label="Gave In" value={stats.gave_in_count} />
        </section>
      )}

      {stats && (
        <OutcomeChart
          resistedCount={stats.resisted_count}
          gaveInCount={stats.gave_in_count}
        />
      )}

      {urges.length > 0 && <CategoryChart urges={urges} />}

      {/* Pending */}
      <section className="section-card">
        <div className="section-header">
          <h2>Pending Urges</h2>
        </div>

        {pendingUrges.length === 0 ? (
          <p>No pending urges.</p>
        ) : (
          pendingUrges.map((u) => (
            <div key={u.id} className="urge-card">
              <h3>{u.template_name || "Urge"}</h3>
              <p>{formatDate(u.created_at)}</p>

              <p>
                Intensity:{" "}
                <span className={getIntensityClass(u.intensity)}>
                  {u.intensity}
                </span>
              </p>

              <button
                className="primary-btn"
                onClick={() => navigate(`/update-urge/${u.id}`)}
              >
                Finish
              </button>
            </div>
          ))
        )}
      </section>

      {/* Completed */}
      <section className="section-card">
        <div className="section-header">
          <h2>Completed Urges</h2>
        </div>

        {completedUrges.length === 0 ? (
          <p>No completed urges.</p>
        ) : (
          completedUrges.map((u) => (
            <div key={u.id} className="urge-card">
              <h3>{u.template_name || "Urge"}</h3>
              <p>{formatDate(u.created_at)}</p>

              <span className={getOutcomeBadgeClass(u.outcome)}>
                {u.outcome}
              </span>

              <button
                className="secondary-btn"
                onClick={() => navigate(`/update-urge/${u.id}`)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </section>
    </AppLayout>
  );
}

export default Dashboard;