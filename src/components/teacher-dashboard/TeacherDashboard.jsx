import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiBook, 
  FiFileText, 
  FiUsers, 
  FiBarChart2, 
  FiUserPlus, 
  FiEdit, 
  FiUpload, 
  FiArrowRight,
  FiDownload,
  FiCalendar,
  FiX,
  FiCheck,
  FiAlertCircle
} from "react-icons/fi";
import { 
  MdOutlineLibraryBooks, 
  MdOutlineQuiz, 
  MdOutlinePeople, 
  MdOutlineInsights,
  MdLocationOn,
  MdOutlineAddCircle,
  MdOutlineDescription
} from "react-icons/md";
import { FaChalkboardTeacher, FaBookOpen, FaUserGraduate } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { BiTrendingUp } from "react-icons/bi";
<<<<<<< Updated upstream
=======

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
>>>>>>> Stashed changes

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState([]);
  const [teachingMaterials, setTeachingMaterials] = useState([]);
  const [recentQuizResults, setRecentQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setUserData({
          name: "Mr. Phiri",
          role: "Biology Teacher",
          school: "Zomba Secondary School",
        });

        setStats([
          { number: "28", label: "Teaching Materials Uploaded" },
          { number: "156", label: "Total Students" },
          { number: "12", label: "Active Quizzes" },
          { number: "78%", label: "Average Class Score" },
        ]);

        setTeachingMaterials([
          {
            type: "LESSON PLAN",
            title: "Cell Structure and Function",
            form: "Form 3",
            views: 142,
            downloads: 67,
            description:
              "Comprehensive lesson plan covering prokaryotic and eukaryotic cells, organelles, and their functions.",
            typeColor: "#e3a525",
          },
          {
            type: "WORKSHEET",
            title: "Photosynthesis Practice",
            form: "Form 2",
            views: 98,
            downloads: 45,
            description:
              "Practice questions and diagrams covering the process of photosynthesis and factors affecting it.",
            typeColor: "#2ea043",
          },
          {
            type: "PRESENTATION",
            title: "Human Digestive System",
            form: "Form 3",
            views: 187,
            downloads: 92,
            description:
              "Slide presentation with diagrams and explanations of digestive organs and processes.",
            typeColor: "#a371f7",
          },
        ]);

        setRecentQuizResults([
          { student: "Chisomo Banda", quiz: "Cell Biology Quiz", form: "Form 3", score: 18, total: 20, date: "Feb 5, 2026" },
          { student: "Mphatso Chirwa", quiz: "Cell Biology Quiz", form: "Form 3", score: 14, total: 20, date: "Feb 5, 2026" },
          { student: "Thandiwe Mwale", quiz: "Photosynthesis Quiz", form: "Form 2", score: 19, total: 20, date: "Feb 4, 2026" },
          { student: "Kondwani Phiri", quiz: "Cell Biology Quiz", form: "Form 3", score: 10, total: 20, date: "Feb 5, 2026" },
          { student: "Grace Mkandawire", quiz: "Photosynthesis Quiz", form: "Form 2", score: 17, total: 20, date: "Feb 4, 2026" },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getScoreColor = (score, total) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return { bg: "#1a4731", color: "#2ea043" };
    if (pct >= 60) return { bg: "#3d2f0a", color: "#e3a525" };
    return { bg: "#3d1a1a", color: "#f85149" };
  };

<<<<<<< Updated upstream
=======
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
      icon: <FiBook className="text-[#2ea043]" size={24} />,
    },
    {
      number: quizzes.length,
      label: "Quizzes Created",
      icon: <MdOutlineQuiz className="text-[#e3b341]" size={24} />,
    },
    {
      number: teacherStats?.totalStudents ?? "—",
      label: "Total Students",
      icon: <FiUsers className="text-[#58a6ff]" size={24} />,
    },
    {
      number: teacherStats
        ? `${teacherStats.avgScore}%`
        : "—",
      label: "Avg Class Score",
      icon: <IoStatsChart className="text-[#a371f7]" size={24} />,
    },
  ];

  // =========================
  // LOADING
  // =========================
>>>>>>> Stashed changes
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* WELCOME BANNER */}
        <div className="bg-[#1a3a2a] border border-[#2ea043] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {userData?.name || "Teacher"}!
              </h1>
              <p className="text-gray-300 text-sm">
                {userData?.role || "Teacher"} | {userData?.school || "School"}
              </p>
            </div>
            <div className="flex gap-3">
=======
=======
>>>>>>> Stashed changes
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <FaChalkboardTeacher className="text-[#2ea043]" />
                Welcome back, {displayName}!
              </h1>

              {displaySchool && (
                <p className="text-gray-300 text-sm flex items-center gap-1">
                  <MdLocationOn size={14} /> {displaySchool}
                </p>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={() => setShowModal(true)}
                className="bg-[#2ea043] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition text-sm flex items-center gap-2"
              >
                <FiUserPlus size={16} /> Add Student
              </button>

>>>>>>> Stashed changes
              <Link
                to="/create-quiz"
                className="bg-[#e3a525] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#f0b429] transition text-sm flex items-center gap-2"
              >
                <FiEdit size={16} /> Create Quiz
              </Link>
              <Link
                to="/upload-material"
                className="bg-gray-700 border border-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition text-sm flex items-center gap-2"
              >
                <FiUpload size={16} /> Upload Material
              </Link>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-gray-800 p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
=======
=======
>>>>>>> Stashed changes
              <div className="mb-1">{stat.icon}</div>

              <div className="text-2xl font-bold text-[#2ea043]">
                {stat.number}
              </div>

              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
>>>>>>> Stashed changes
            </div>
          ))}
        </div>

<<<<<<< Updated upstream
        {/* TEACHING MATERIALS */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📖 My Teaching Materials</h2>
=======
        {/* Student Progress */}
        {teacherStats && teacherStats.totalStudents > 0 && (
          <div className="mb-8 bg-[#161b22] border border-[#21262d] rounded-lg p-4 flex items-center justify-between hover:border-[#2ea043] transition">
            <div>
              <p className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
                <BiTrendingUp className="text-[#2ea043]" />
                Student Progress Overview
              </p>

              <p className="text-xs text-[#6e7681] mt-0.5">
                <FiUsers className="inline mr-1" size={12} />
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
              className="bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition flex-shrink-0 flex items-center gap-1"
            >
              View Progress <FiArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Recent Materials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaBookOpen /> My Recent Materials
            </h2>

>>>>>>> Stashed changes
            <Link
              to="/teaching-materials"
              className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              + Manage Materials
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teachingMaterials.map((material, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#2ea043] transition"
              >
                <div
                  className="text-xs font-bold mb-2"
                  style={{ color: material.typeColor }}
                >
                  {material.type}
                </div>
                <h3 className="font-semibold text-white mb-3">{material.title}</h3>
                <div className="flex gap-4 text-xs text-gray-400 mb-3">
                  <span>📅 {material.form}</span>
                  <span>👁 {material.views} views</span>
                  <span>⬇️ {material.downloads} downloads</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">{material.description}</p>
                <div className="flex gap-2">
                  <button className="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-red-700 transition">
                    View
                  </button>
                  <button className="bg-gray-700 border border-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded hover:border-[#2ea043] transition">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUIZ RESULTS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📊 Recent Quiz Results</h2>
            <Link
              to="/student-progress"
              className="bg-gray-700 border border-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition"
            >
              View All
            </Link>
          </div>

<<<<<<< Updated upstream
          <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-white">
              <div>Student Name</div>
              <div>Quiz</div>
              <div>Form</div>
              <div>Score</div>
              <div>Date</div>
=======
          {resources.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              <div className="text-4xl mb-3 flex justify-center">
                <MdOutlineLibraryBooks size={48} className="text-gray-600" />
              </div>
              <p className="text-sm">
                No materials uploaded yet.
              </p>
>>>>>>> Stashed changes
            </div>

            {recentQuizResults.map((result, i) => {
              const scoreStyle = getScoreColor(result.score, result.total);
              return (
                <div
                  key={i}
                  className="grid grid-cols-5 px-4 py-4 border-b border-gray-800 last:border-none hover:bg-[#0d1117] transition text-sm text-gray-400"
                >
<<<<<<< Updated upstream
                  <div className="text-white">{result.student}</div>
                  <div>{result.quiz}</div>
                  <div>{result.form}</div>
                  <div>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: scoreStyle.bg, color: scoreStyle.color }}
                    >
                      {result.score}/{result.total}
                    </span>
                  </div>
                  <div>{result.date}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
=======
                  <div className="text-xs font-bold mb-2 text-[#58a6ff]">
                    {r.type}
                  </div>

                  <h3 className="font-semibold text-white mb-3 truncate">
                    {r.title}
                  </h3>

                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
                    {r.targetClass?.name && (
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {r.targetClass.name}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <FiDownload size={12} /> {r.downloadCount ?? 0} downloads
                    </span>
                  </div>

                  {r.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex items-start gap-1">
                      <MdOutlineDescription className="mt-0.5 flex-shrink-0" size={14} />
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
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiBarChart2 /> My Recent Quizzes
            </h2>

            <Link
              to="/create-quiz"
              className="bg-gray-700 border border-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition flex items-center gap-1"
            >
              <MdOutlineAddCircle /> Create New
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              <div className="text-4xl mb-3 flex justify-center">
                <MdOutlineQuiz size={48} className="text-gray-600" />
              </div>
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
                  <div className="text-white truncate flex items-center gap-2">
                    <FiFileText size={14} className="text-[#2ea043]" />
                    {q.title}
                  </div>

                  <div>{q.subject}</div>

                  <div>{q.form}</div>

                  <div className="flex items-center gap-1">
                    <FiCalendar size={12} />
                    {formatDate(q.createdAt)}
                  </div>
                </div>
              ))}

              {quizzes.length > 5 && (
                <div className="px-4 py-3 text-center border-t border-gray-800">
                  <Link
                    to="/create-quiz?view=saved"
                    className="text-sm text-[#58a6ff] hover:underline inline-flex items-center gap-1"
                  >
                    View all {quizzes.length} quizzes <FiArrowRight size={12} />
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
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: "#e6edf3" }}
              >
                <FaUserGraduate size={16} />
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
                <FiX />
              </button>
            </div>

            <div className="p-5">
              {formError && (
                <div
                  className="mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                  style={{
                    backgroundColor: "#3d1f1f",
                    border: "1px solid #f85149",
                    color: "#f85149",
                  }}
                >
                  <FiAlertCircle size={14} />
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div
                  className="mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2"
                  style={{
                    backgroundColor: "#1a2f1a",
                    border: "1px solid #2ea043",
                    color: "#3fb950",
                  }}
                >
                  <FiCheck size={14} />
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
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2ea043] text-white flex items-center gap-2"
                  >
                    {formLoading ? "Adding..." : <><FiUserPlus size={14} /> Add Student</>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={formLoading}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1c2330] border border-[#21262d] text-[#8b949e] flex items-center gap-2"
                  >
                    <FiX size={14} /> Cancel
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default TeacherDashboard;