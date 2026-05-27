import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [teacherStats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // CREATE STUDENT STATES
  // =========================
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio: "",
    dateOfBirth: "",
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const token = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const [
          profileRes,
          resourcesRes,
          quizzesRes,
          statsRes,
        ] = await Promise.all([
          fetch(`${API_BASE}/profiles/me`, { headers }),
          fetch(`${API_BASE}/resources`, { headers }),
          fetch(`${API_BASE}/quizzes/mine`, { headers }),
          fetch(`${API_BASE}/quizzes/teacher/stats`, { headers }),
        ]);

        if (profileRes.ok) {
          setUserData(await profileRes.json());
        }

        if (resourcesRes.ok) {
          const data = await resourcesRes.json();

          const arr = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : [];

          const user = (() => {
            try {
              return JSON.parse(localStorage.getItem("user"));
            } catch {
              return {};
            }
          })();

          setResources(
            arr
              .filter((r) => r.uploaderId == user?.id)
              .slice(0, 3)
          );
        }

        if (quizzesRes.ok) {
          setQuizzes(await quizzesRes.json());
        }

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =========================
  // CREATE STUDENT
  // =========================
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setFormError(null);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    setFormError(null);
    setFormSuccess(null);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/profiles`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            bio: formData.bio || undefined,
            dateOfBirth: formData.dateOfBirth || undefined,
            role: "STUDENT",
            schoolId: userData?.school?.id ?? undefined,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        throw new Error(
          data?.message ?? `Request failed with status ${res.status}`
        );
      }

      setFormSuccess("Student added successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        bio: "",
        dateOfBirth: "",
      });

      setTimeout(() => {
        setShowModal(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // =========================
  // HELPERS
  // =========================
  const formatDate = (d) => {
    if (!d) return "—";

    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayName = userData
    ? `${userData.firstName} ${userData.lastName}`
    : "Teacher";

  const displaySchool = userData?.school?.name ?? "";

  const stats = [
    {
      number: resources.length,
      label: "Materials Uploaded",
      icon: "📚",
    },
    {
      number: quizzes.length,
      label: "Quizzes Created",
      icon: "📝",
    },
    {
      number: teacherStats?.totalStudents ?? "—",
      label: "Total Students",
      icon: "👥",
    },
    {
      number: teacherStats
        ? `${teacherStats.avgScore}%`
        : "—",
      label: "Avg Class Score",
      icon: "📊",
    },
  ];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2ea043] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#8b949e]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="bg-[#1a3a2a] border border-[#2ea043] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {displayName}!
              </h1>

              {displaySchool && (
                <p className="text-gray-300 text-sm">
                  📍 {displaySchool}
                </p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#2ea043] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition text-sm"
              >
                👨‍🎓 Add Student
              </button>

              <Link
                to="/create-quiz"
                className="bg-[#e3a525] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#f0b429] transition text-sm"
              >
                ✏️ Create Quiz
              </Link>

              <Link
                to="/upload-material"
                className="bg-gray-700 border border-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition text-sm"
              >
                📤 Upload Material
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-gray-800 p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>

              <div className="text-2xl font-bold text-[#2ea043]">
                {stat.number}
              </div>

              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Student Progress */}
        {teacherStats && teacherStats.totalStudents > 0 && (
          <div className="mb-8 bg-[#161b22] border border-[#21262d] rounded-lg p-4 flex items-center justify-between hover:border-[#2ea043] transition">
            <div>
              <p className="text-sm font-semibold text-[#e6edf3]">
                📊 Student Progress Overview
              </p>

              <p className="text-xs text-[#6e7681] mt-0.5">
                {teacherStats.totalStudents} student
                {teacherStats.totalStudents !== 1 ? "s" : ""} have attempted your quizzes ·
                Class average:{" "}
                <span className="font-bold text-[#2ea043]">
                  {teacherStats.avgScore}%
                </span>
              </p>
            </div>

            <Link
              to="/create-quiz?view=progress"
              className="bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition flex-shrink-0"
            >
              View Progress →
            </Link>
          </div>
        )}

        {/* Recent Materials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              📖 My Recent Materials
            </h2>

            <Link
              to="/resources"
              className="bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition"
            >
              View All
            </Link>
          </div>

          {resources.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">
                No materials uploaded yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#2ea043] transition"
                >
                  <div className="text-xs font-bold mb-2 text-[#58a6ff]">
                    {r.type}
                  </div>

                  <h3 className="font-semibold text-white mb-3 truncate">
                    {r.title}
                  </h3>

                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
                    {r.targetClass?.name && (
                      <span>📅 {r.targetClass.name}</span>
                    )}

                    <span>
                      ⬇️ {r.downloadCount ?? 0} downloads
                    </span>
                  </div>

                  {r.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {r.description}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      r.fileUrl && window.open(r.fileUrl, "_blank")
                    }
                    className="bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              📊 My Recent Quizzes
            </h2>

            <Link
              to="/create-quiz"
              className="bg-gray-700 border border-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition"
            >
              + Create New
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>

              <p className="text-sm">
                No quizzes created yet.
              </p>
            </div>
          ) : (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-white">
                <div>Title</div>
                <div>Subject</div>
                <div>Form</div>
                <div>Created</div>
              </div>

              {quizzes.slice(0, 5).map((q) => (
                <div
                  key={q.id}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 py-4 border-b border-gray-800 last:border-none hover:bg-[#0d1117] transition text-sm text-gray-400"
                >
                  <div className="text-white truncate">
                    {q.title}
                  </div>

                  <div>{q.subject}</div>

                  <div>{q.form}</div>

                  <div>{formatDate(q.createdAt)}</div>
                </div>
              ))}

              {quizzes.length > 5 && (
                <div className="px-4 py-3 text-center border-t border-gray-800">
                  <Link
                    to="/create-quiz?view=saved"
                    className="text-sm text-[#58a6ff] hover:underline"
                  >
                    View all {quizzes.length} quizzes →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* ADD STUDENT MODAL */}
      {/* ========================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-xl overflow-hidden"
            style={{
              backgroundColor: "#161b22",
              border: "1px solid #21262d",
            }}
          >
            <div
              className="px-5 py-4 flex justify-between items-center"
              style={{
                borderBottom: "1px solid #21262d",
              }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: "#e6edf3" }}
              >
                Add New Student
              </h2>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  color: "#8b949e",
                  fontSize: "20px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div className="p-5">
              {formError && (
                <div
                  className="mb-4 px-3 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "#3d1f1f",
                    border: "1px solid #f85149",
                    color: "#f85149",
                  }}
                >
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div
                  className="mb-4 px-3 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "#1a2f1a",
                    border: "1px solid #2ea043",
                    color: "#3fb950",
                  }}
                >
                  {formSuccess}
                </div>
              )}

              <form onSubmit={handleAddStudent}>
                <div className="grid grid-cols-2 gap-3 mb-3">

                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    placeholder="First name"
                    className="bg-[#1c2330] border border-[#21262d] rounded-lg px-3 py-2 text-white"
                  />

                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    placeholder="Last name"
                    className="bg-[#1c2330] border border-[#21262d] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    placeholder="Email"
                    className="w-full bg-[#1c2330] border border-[#21262d] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    placeholder="Password"
                    className="w-full bg-[#1c2330] border border-[#21262d] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    className="w-full bg-[#1c2330] border border-[#21262d] rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="mb-4">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    disabled={formLoading}
                    rows="2"
                    placeholder="Bio"
                    className="w-full bg-[#1c2330] border border-[#21262d] rounded-lg px-3 py-2 text-white resize-none"
                  />
                </div>

                <div
                  className="mb-4 px-3 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "#1c2330",
                    border: "1px solid #21262d",
                    color: "#8b949e",
                  }}
                >
                  Role:{" "}
                  <span className="text-[#388bfd] font-semibold">
                    STUDENT
                  </span>

                  <br />

                  School:{" "}
                  <span className="text-[#2ea043] font-semibold">
                    Automatically assigned from teacher account
                  </span>
                </div>

                <div className="flex gap-2">

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2ea043] text-white"
                  >
                    {formLoading ? "Adding..." : "Add Student"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={formLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1c2330] border border-[#21262d] text-[#8b949e]"
                  >
                    Cancel
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;