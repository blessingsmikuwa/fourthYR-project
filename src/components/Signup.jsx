import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Signup = () => {
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [school, setSchool] = useState("");
  const [bio, setBio] = useState("");
  const [level, setLevel] = useState("Form 1");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Implement signup logic with backend API
    console.log({
      role,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      school,
      bio,
      level
    });

    // Navigate based on selected role
    if (role === "student") {
      navigate("/student");
    } else if (role === "teacher") {
      navigate("/teacher");
    }
  };

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
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
            required
          />

          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
            required
          />

          {role === "student" && (
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            >
              <option value="Form 1">Form 1</option>
              <option value="Form 2">Form 2</option>
              <option value="Form 3">Form 3</option>
              <option value="Form 4">Form 4</option>
            </select>
          )}

          <input
            type="text"
            placeholder="School"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
            required
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full min-h-[100px] bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#2ea043] text-white py-2 rounded-md hover:bg-[#238636] transition-colors"
          >
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