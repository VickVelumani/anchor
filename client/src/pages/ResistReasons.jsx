import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import API from "../api/axios";

function ResistReasons() {
  const [reasons, setReasons] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await API.get("/profile/reasons");
        setReasons(res.data.resist_reasons || "");
      } catch (err) {
        console.error("GET REASONS ERROR:", err);
        setError("Failed to load your reasons");
      }
    };

    fetchReasons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      const res = await API.put("/profile/reasons", {
        resist_reasons: reasons,
      });

      setReasons(res.data.resist_reasons || "");
      setStatus("Reasons saved successfully");
    } catch (err) {
      console.error("SAVE REASONS ERROR:", err);
      setError("Failed to save reasons");
    }
  };

  return (
    <AppLayout>
      <div className="form-page">
        <div className="form-card">
          <h1>Why I Want to Resist</h1>
          <p className="form-subtext">
            Write down the reasons you want to stay in control. Anchor can show
            these back to you during vulnerable moments.
          </p>

          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="styled-form">
            <div>
              <label htmlFor="resistReasons">Your reasons</label>
              <textarea
                id="resistReasons"
                rows="8"
                value={reasons}
                onChange={(e) => setReasons(e.target.value)}
                placeholder={`Example:
I want better discipline.
I want more self-respect.
I want to stop acting on impulse.
I want better focus and energy.`}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                Save Reasons
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default ResistReasons;