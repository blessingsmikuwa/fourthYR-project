import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Navigate based on selected role
    if (role === "student") {
      navigate("/student");
    } else if (role === "teacher") {
      navigate("/teacher");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-[360px] bg-[#161b22] border border-[#21262d] p-6 rounded-lg">

        {/* TITLE */}
        <h2 className="text-xl text-[#e6edf3] font-semibold mb-1">
          Login
        </h2>
        <p className="text-sm text-[#6e7681] mb-5">
          Access your account
        </p>

        {/* ROLE SELECT */}
        <div className="flex mb-4 bg-[#0d1117] rounded-md p-1">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 py-1 text-sm rounded-md ${
              role === "student"
                ? "bg-[#2ea043] text-white"
                : "text-[#8b949e]"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setRole("teacher")}
            className={`flex-1 py-1 text-sm rounded-md ${
              role === "teacher"
                ? "bg-[#2ea043] text-white"
                : "text-[#8b949e]"
            }`}
          >
            Teacher
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] outline-none"
          />

          <button
            type="submit"
            className="w-full bg-[#2ea043] text-white py-2 rounded-md"
          >
            Login as {role}
          </button>
        </form>

        {/* SIGNUP LINK */}
        <p className="text-sm text-[#6e7681] mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#2ea043]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;