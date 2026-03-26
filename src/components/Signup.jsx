import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Signup = () => {
  const [role, setRole] = useState("student");

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[360px] bg-[#161b22] border border-[#21262d] p-6 rounded-lg">

        <h2 className="text-xl text-[#e6edf3] font-semibold mb-1">
          Create Account
        </h2>
        <p className="text-sm text-[#6e7681] mb-5">
          Sign up as Student or Teacher
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
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3]"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3]"
          />

          <button className="w-full bg-[#2ea043] text-white py-2 rounded-md">
            Sign up as {role}
          </button>
        </form>

        <p className="text-sm text-[#6e7681] mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-[#2ea043]">
            Login
          </Link>
        </p>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;