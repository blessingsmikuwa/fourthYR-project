import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Signup = () => {
  const [role, setRole] = useState("STUDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [bio, setBio] = useState("");
  const [level, setLevel] = useState("Form 1");
  const [libraryCardNumber, setLibraryCardNumber] = useState("");

  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [schoolsError, setSchoolsError] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch schools on mount.
  // NOTE: GET /school requires JwtAuthGuard to be removed for this to work
  // without a token. In your SchoolController, remove @UseGuards(JwtAuthGuard)
  // from the class level or add a separate public route for GET.
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/school`);
        if (!response.ok) throw new Error("Failed to fetch schools");
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setSchoolsError("Could not load schools. Please refresh the page.");
      } finally {
        setSchoolsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const payload = {
      firstName,
      lastName,
      email,
      password,
      role,
      schoolId,
      libraryCardNumber,
      bio: role === "STUDENT" ? `${bio} | Level: ${level}` : bio,
      dateOfBirth,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Registration failed. Please try again.";
        setError(message);
        return;
      }

      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      const userRole = data.user.role;
      if (userRole === "STUDENT") navigate("/student");
      else if (userRole === "TEACHER") navigate("/teacher");
      else if (userRole === "ADMIN") navigate("/admin");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
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

          {error && (
            <div className="mb-4 px-3 py-2 bg-[#3d1f1f] border border-[#f85149] rounded-md text-sm text-[#f85149]">
              {error}
            </div>
          )}

          {/* ROLE SELECT */}
          <div className="flex mb-4 bg-[#0d1117] rounded-md p-1">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`flex-1 py-1 text-sm rounded-md ${
                role === "STUDENT" ? "bg-[#2ea043] text-white" : "text-[#8b949e]"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`flex-1 py-1 text-sm rounded-md ${
                role === "TEACHER" ? "bg-[#2ea043] text-white" : "text-[#8b949e]"
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
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            />

            <input
              type="text"
              placeholder="Library Card Number"
              value={libraryCardNumber}
              onChange={(e) => setLibraryCardNumber(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            />

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            />

            {/* LEVEL — static, classes endpoint requires JWT so can't fetch pre-login */}
            {role === "STUDENT" && (
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              >
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            )}

            {/* SCHOOL SELECT — fetched from GET /school */}
            {schoolsError ? (
              <p className="text-sm text-[#f85149]">{schoolsError}</p>
            ) : (
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                disabled={schoolsLoading}
                className="w-full bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none disabled:opacity-50"
                required
              >
                <option value="">
                  {schoolsLoading ? "Loading schools..." : "Select School"}
                </option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full min-h-[100px] bg-[#0d1117] border border-[#21262d] rounded-md px-3 py-2 text-sm text-[#e6edf3] focus:border-[#2ea043] outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading || schoolsLoading}
              className="w-full bg-[#2ea043] text-white py-2 rounded-md hover:bg-[#238636] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Signing up..."
                : `Sign up as ${role === "STUDENT" ? "Student" : "Teacher"}`}
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