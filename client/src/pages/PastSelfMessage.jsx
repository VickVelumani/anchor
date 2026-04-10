import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import API from "../api/axios";

function PastSelfMessage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await API.get("/profile/message");
        setMessage(res.data.past_self_message || "");
      } catch (err) {
        console.error("GET MESSAGE ERROR:", err);
        setError("Failed to load your message");
      }
    };

    fetchMessage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      const res = await API.put("/profile/message", {
        past_self_message: message,
      });

      setMessage(res.data.past_self_message || "");
      setStatus("Message saved successfully");
    } catch (err) {
      console.error("SAVE MESSAGE ERROR:", err);
      setError("Failed to save message");
    }
  };

  return (
    <AppLayout>
      <div className="form-page">
        <div className="form-card">
          <h1>Message From Past Me</h1>
          <p className="form-subtext">
            Write a message to yourself that Anchor can show you during vulnerable moments.
          </p>

          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="styled-form">
            <div>
              <label htmlFor="pastSelfMessage">Your message</label>
              <textarea
                id="pastSelfMessage"
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: This urge will pass. Do not trade your progress for temporary relief."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                Save Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default PastSelfMessage;