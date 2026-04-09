import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const Login = () => {
  const [role, setRole]         = useState("student");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? "Invalid email or password.");
      }

      const { accessToken, refreshToken, user } = data;

      // Block admins from using this login page
      if (user.role === "ADMIN") {
        setError("Admins must use the admin portal to sign in.");
        return;
      }

      // Enforce role matches selected tab
      const expectedRole = role.toUpperCase();
      if (user.role !== expectedRole) {
        setError(`This account is not a ${role}. Please select the correct role.`);
        return;
      }

      // Store auth
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate based on role
      if (user.role === "STUDENT") {
        navigate("/student");
      } else if (user.role === "TEACHER") {
        navigate("/teacher");
      }

    } catch (err) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[360px] bg-[#161b22] border border-[#21262d] p-6 rounded-lg">

          {/* Title */}
          <h2 className="text-xl text-[#e6edf3] font-semibold mb-1">Login</h2>
          <p className="text-sm text-[#6e7681] mb-5">Access your account</p>

          {/* Role toggle */}
          <div className="flex mb-4 bg-[#0d1117] rounded-md p-1">
            <button
              type="button"
              onClick={() => { setRole("student"); setError(""); }}
              className={`flex-1 py-1 text-sm rounded-md transition ${
                role === "student" ? "bg-[#2ea043] text-white" : "text-[#8b949e]"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setRole("teacher"); setError(""); }}
              className={`flex-1 py-1 text-sm rounded-md transition ${
                role === "teacher" ? "bg-[#2ea043] text-white" : "text-[#8b949e]"
              }`}
            >
              Teacher
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-3 py-2 rounded-md text-xs"
              style={{ backgroundColor: '#3d1f1f', border: '1px solid #f85149', color: '#f85149' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              disabled={loading}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] outline-none focus:border-[#388bfd] disabled:opacity-50"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              disabled={loading}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] outline-none focus:border-[#388bfd] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2ea043] text-white py-2 rounded-md text-sm font-medium hover:bg-[#3fb950] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : `Login as ${role}`}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-sm text-[#6e7681] mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#2ea043]">Sign up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;