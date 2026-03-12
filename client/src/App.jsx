import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import TimetableGenerator from "./components/TimetableGenerator";

import "./App.css";

function ProtectedAdmin({ children }) {

  const isAdmin = localStorage.getItem("adminAuth");

  return isAdmin ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

      <Route path="/timetable" element={<TimetableGenerator />} />

        {/* admin login */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* protected admin panel */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdmin>
              <AdminPanel />
            </ProtectedAdmin>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;