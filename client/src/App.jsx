import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LogUrge from "./pages/LogUrge";
import UpdateUrge from "./pages/UpdateUrge";
import HelpMeResist from "./pages/HelpMeResist";
import MyUrges from "./pages/MyUrges";
import EditUrgeTemplate from "./pages/EditUrgeTemplate";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-urges"
        element={
          <ProtectedRoute>
            <MyUrges />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-urges/:id"
        element={
          <ProtectedRoute>
            <EditUrgeTemplate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/log-urge"
        element={
          <ProtectedRoute>
            <LogUrge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/update-urge/:id"
        element={
          <ProtectedRoute>
            <UpdateUrge />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help-me-resist"
        element={
          <ProtectedRoute>
            <HelpMeResist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help-me-resist/:id"
        element={
          <ProtectedRoute>
            <HelpMeResist />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;