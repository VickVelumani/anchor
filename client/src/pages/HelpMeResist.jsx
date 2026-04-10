import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import API from "../api/axios";

function HelpMeResist() {
  const { id } = useParams();

  const [urge, setUrge] = useState(null);
  const [pastSelfMessage, setPastSelfMessage] = useState("");
  const [resistReasons, setResistReasons] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUrgeSupport = async () => {
      try {
        const res = await API.get(`/urges/${id}`);

        setUrge(res.data);
        setPastSelfMessage(res.data.past_self_message || "");
        setResistReasons(res.data.resist_reasons || "");
        setActionPlan(res.data.action_plan || "");
      } catch (err) {
        console.error("HELP ME RESIST ERROR:", err);
        setError("Failed to load support for this urge.");
      }
    };

    if (id) {
      fetchUrgeSupport();
    }
  }, [id]);

  return (
    <AppLayout>
      <div className="resist-page">
        <section className="resist-hero">
          <h1>Help Me Resist</h1>
          <p>
            Pause for a moment. You do not need to act on this urge right now.
            Take one good step before doing anything else.
          </p>
        </section>

        {error && <p className="error-text">{error}</p>}

        {urge && (
          <section className="resist-section">
            <div className="resist-section-header">
              <h2>Current Urge</h2>
            </div>

            <div className="resist-content-card">
              <p>
                <strong>Urge Type:</strong> {urge.template_name || "Unknown"}
              </p>
              <p>
                <strong>Trigger:</strong> {urge.trigger_note || "No trigger noted"}
              </p>
            </div>
          </section>
        )}

        <section className="resist-section">
          <div className="resist-section-header">
            <h2>General Tips</h2>
          </div>

          <div className="resist-content-card">
            <ul className="resist-tips-list">
              <li>Pause for 60 seconds before doing anything.</li>
              <li>Put some distance between yourself and the trigger.</li>
              <li>Change rooms or move your body for a minute.</li>
              <li>Take a few slow breaths and interrupt autopilot.</li>
              <li>Do the first step of your action plan right now.</li>
            </ul>
          </div>
        </section>

        <section className="resist-section">
          <div className="resist-section-header">
            <h2>Message From Past Me</h2>
          </div>

          <div className="resist-content-card">
            <p style={{ whiteSpace: "pre-line" }}>
              {pastSelfMessage || "You haven’t written a past self message for this urge yet."}
            </p>
          </div>
        </section>

        <section className="resist-section">
          <div className="resist-section-header">
            <h2>Why I Want to Resist</h2>
          </div>

          <div className="resist-content-card">
            <p style={{ whiteSpace: "pre-line" }}>
              {resistReasons || "You haven’t written your reasons for this urge yet."}
            </p>
          </div>
        </section>

        <section className="resist-section">
          <div className="resist-section-header">
            <h2>Action Plan</h2>
          </div>

          <div className="resist-content-card">
            <p style={{ whiteSpace: "pre-line" }}>
              {actionPlan || "You haven’t created an action plan for this urge yet."}
            </p>
          </div>
        </section>

        <section className="resist-footer-actions">
          <Link to="/dashboard" className="secondary-btn">
            Back to Dashboard
          </Link>
          <Link to="/log-urge" className="primary-btn">
            Log New Urge
          </Link>
        </section>
      </div>
    </AppLayout>
  );
}

export default HelpMeResist;