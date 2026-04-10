import { Link, useNavigate } from "react-router-dom";

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/dashboard" className="brand">
            Anchor
          </Link>
        </div>

        {token && (
          <div className="nav-right">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>

            <Link to="/my-urges" className="nav-link">
              My Urges
            </Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="page-container">{children}</main>
    </div>
  );
}