import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Wrong admin password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <h1 className="login-title">Admin Login</h1>
        <form onSubmit={handleAdminLogin}>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="admin-input"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;