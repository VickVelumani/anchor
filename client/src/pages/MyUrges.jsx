import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import API from "../api/axios";

function MyUrges() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    past_self_message: "",
    resist_reasons: "",
    action_plan: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await API.get("/urge-templates");
      setTemplates(res.data);
    } catch (err) {
      console.error("FETCH TEMPLATES ERROR:", err);
      setError("Failed to load your urges.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    try {
      await API.post("/urge-templates", formData);

      setStatus("Urge type created successfully.");

      setFormData({
        name: "",
        description: "",
        past_self_message: "",
        resist_reasons: "",
        action_plan: "",
      });

      fetchTemplates();
    } catch (err) {
      console.error("CREATE TEMPLATE ERROR:", err);
      setError("Failed to create urge type.");
    }
  };

  return (
    <AppLayout>
      <section className="dashboard-header">
        <div>
          <h1>My Urges</h1>
          <p>Create systems for each urge so you're ready before it hits.</p>
        </div>
      </section>

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}

      {/* CREATE */}
      <section className="section-card">
        <div className="section-header">
          <h2>Create New Urge Type</h2>
        </div>

        <form onSubmit={handleSubmit} className="styled-form">
          <div>
            <label>Urge Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Porn, Junk Food, Scrolling..."
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="When does this usually happen?"
            />
          </div>

          <div>
            <label>Past Self Message</label>
            <textarea
              name="past_self_message"
              rows="3"
              value={formData.past_self_message}
              onChange={handleChange}
              placeholder="What would your clear self say?"
            />
          </div>

          <div>
            <label>Why Resist</label>
            <textarea
              name="resist_reasons"
              rows="3"
              value={formData.resist_reasons}
              onChange={handleChange}
              placeholder="Why does this matter?"
            />
          </div>

          <div>
            <label>Action Plan</label>
            <textarea
              name="action_plan"
              rows="3"
              value={formData.action_plan}
              onChange={handleChange}
              placeholder="What should you do instead?"
            />
          </div>

          <button type="submit" className="primary-btn">
            Create Urge System
          </button>
        </form>
      </section>

      {/* LIST */}
      <section className="section-card">
        <div className="section-header">
          <h2>Your Urge Systems</h2>
        </div>

        {templates.length === 0 ? (
          <p>No urges yet.</p>
        ) : (
          <div className="toolkit-grid">
            {templates.map((t) => (
              <div key={t.id} className="toolkit-card">
                <h3>{t.name}</h3>
                <p className="section-subtext">
                  {t.description || "No description"}
                </p>

                <div className="toolkit-preview">
                  {t.resist_reasons
                    ? t.resist_reasons.slice(0, 80) + "..."
                    : "No reasons yet"}
                </div>

                <div className="form-actions">
                  {/* 🔥 KEY ADDITION */}
                  <button
                    className="primary-btn"
                    onClick={() =>
                      navigate("/log-urge", {
                        state: { templateId: t.id },
                      })
                    }
                  >
                    Log This Urge
                  </button>

                  <Link
                    to={`/my-urges/${t.id}`}
                    className="secondary-btn"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}

export default MyUrges;