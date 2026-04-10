import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AppLayout from "../components/AppLayout";

function LogUrge() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    template_id: "",
    intensity: "",
    trigger_note: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await API.get("/urge-templates");
        setTemplates(res.data);
      } catch (err) {
        console.error("FETCH TEMPLATES ERROR:", err);
        setError("Failed to load your urge types");
      }
    };

    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await API.post("/urges", {
        template_id: Number(formData.template_id),
        intensity: Number(formData.intensity),
        trigger_note: formData.trigger_note,
      });

      setMsg(res.data.message || "Urge logged successfully");

      if (res.data.id) {
        navigate(`/help-me-resist/${res.data.id}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("LOG URGE ERROR:", err);
      setError("Failed to log urge");
    }
  };

  return (
    <AppLayout>
      <div className="form-page">
        <div className="form-card">
          <h1>Log Urge</h1>
          <p className="form-subtext">
            Choose the urge you are dealing with right now so Anchor can show
            you the right support for it.
          </p>

          {msg && <p className="success-text">{msg}</p>}
          {error && <p className="error-text">{error}</p>}

          {templates.length === 0 ? (
            <div className="empty-state">
              <p>You have not created any urge types yet.</p>
              <button
                className="primary-btn"
                onClick={() => navigate("/my-urges")}
              >
                Go to My Urges
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="styled-form">
              <div>
                <label htmlFor="template_id">Which urge is this?</label>
                <select
                  id="template_id"
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an urge type</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="intensity">Intensity (1-10)</label>
                <input
                  id="intensity"
                  name="intensity"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="How strong is the urge?"
                  value={formData.intensity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="trigger_note">What triggered it?</label>
                <textarea
                  id="trigger_note"
                  name="trigger_note"
                  rows="5"
                  placeholder="What happened right before the urge?"
                  value={formData.trigger_note}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard
                </button>

                <button type="submit" className="primary-btn">
                  Log Urge
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default LogUrge;