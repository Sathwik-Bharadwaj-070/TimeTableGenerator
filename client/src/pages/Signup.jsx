import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://timetablegenerator-1-znsh.onrender.com/signup", {
        username,
        email,
        password
      });
      alert("Signup successful");
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card fade-in">
        <h1 className="login-title">Create Account</h1>
        <form onSubmit={handleSignup}>
          <div className="field-group">
            <label className="field-label">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Signup
          </button>

          <p className="auth-footer-text">
            Already have an account? <Link to="/" className="auth-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;