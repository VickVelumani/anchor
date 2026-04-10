import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import API from "../api/axios";

function ActionPlan() {
  const [actionPlan, setActionPlan] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActionPlan = async () => {
      try {
        const res = await API.get("/profile/action-plan");
        setActionPlan(res.data.action_plan || "");
      } catch (err) {
        console.error("GET ACTION PLAN ERROR:", err);
        setError("Failed to load your action plan");
      }
    };

    fetchActionPlan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      const res = await API.put("/profile/action-plan", {
        action_plan: actionPlan,
      });

      setActionPlan(res.data.action_plan || "");
      setStatus("Action plan saved successfully");
    } catch (err) {
      console.error("SAVE ACTION PLAN ERROR:", err);
      setError("Failed to save action plan");
    }
  };

  return (
    <AppLayout>
      <div className="form-page">
        <div className="form-card">
          <h1>My Emergency Action Plan</h1>
          <p className="form-subtext">
            Write the steps you want to follow when you feel an urge and need a
            clear plan.
          </p>

          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="styled-form">
            <div>
              <label htmlFor="actionPlan">Your action plan</label>
              <textarea
                id="actionPlan"
                rows="8"
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                placeholder={`Example:
1. Put my phone away
2. Stand up immediately
3. Leave the room
4. Read my message from past me
5. Re-evaluate before doing anything`}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                Save Action Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default ActionPlan;