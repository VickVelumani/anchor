import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import API from "../api/axios";

function EditUrgeTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    past_self_message: "",
    resist_reasons: "",
    action_plan: "",
  });

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await API.get(`/urge-templates/${id}`);

        setFormData({
          name: res.data.name || "",
          description: res.data.description || "",
          past_self_message: res.data.past_self_message || "",
          resist_reasons: res.data.resist_reasons || "",
          action_plan: res.data.action_plan || "",
        });
      } catch (err) {
        console.error("FETCH SINGLE TEMPLATE ERROR:", err);
        setError("Failed to load urge type.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    try {
      await API.put(`/urge-templates/${id}`, formData);
      setStatus("Urge type updated successfully.");
    } catch (err) {
      console.error("UPDATE TEMPLATE ERROR:", err);
      setError("Failed to update urge type.");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <p>Loading...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="form-page">
        <div className="form-card">
          <h1>Edit Urge Type</h1>
          <p className="form-subtext">
            Customize the support content for this specific urge so Anchor can
            help you better in the moment.
          </p>

          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="styled-form">
            <div>
              <label htmlFor="name">Urge Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Porn"
                required
              />
            </div>

            <div>
              <label htmlFor="description">Short Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="What usually happens with this urge?"
              />
            </div>

            <div>
              <label htmlFor="past_self_message">Past Self Message</label>
              <textarea
                id="past_self_message"
                name="past_self_message"
                rows="5"
                value={formData.past_self_message}
                onChange={handleChange}
                placeholder="What would your clear-minded self want to tell you during this urge?"
              />
            </div>

            <div>
              <label htmlFor="resist_reasons">Why I Want to Resist</label>
              <textarea
                id="resist_reasons"
                name="resist_reasons"
                rows="5"
                value={formData.resist_reasons}
                onChange={handleChange}
                placeholder="Why does resisting this specific urge matter to you?"
              />
            </div>

            <div>
              <label htmlFor="action_plan">Action Plan</label>
              <textarea
                id="action_plan"
                name="action_plan"
                rows="5"
                value={formData.action_plan}
                onChange={handleChange}
                placeholder="What should you do when this urge hits?"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/my-urges")}
              >
                Back to My Urges
              </button>

              <button type="submit" className="primary-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default EditUrgeTemplate;