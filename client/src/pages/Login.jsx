import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const navigate = useNavigate();

const handleLogin = async (e) => {
e.preventDefault();


try {
  const res = await axios.post(
    "https://timetablegenerator-1-znsh.onrender.com/login",
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(res.data);

  // Save token
  localStorage.setItem("token", res.data.token);

  // Navigate to timetable
  navigate("/timetable");

} catch (error) {
  console.error(error);
  alert("Login failed");
}


};

return ( <div className="login-page"> <div className="login-card fade-in"> <h1 className="login-title">User Login</h1>

```
    <form onSubmit={handleLogin}>
      <div className="field-group">
        <label className="field-label">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          className="admin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="login-btn">
        Login
      </button>

      <p className="auth-footer-text">
        Don't have an account?{" "}
        <Link to="/signup" className="auth-link">
          Signup
        </Link>
      </p>
    </form>
  </div>
</div>


);
}

export default Login;
