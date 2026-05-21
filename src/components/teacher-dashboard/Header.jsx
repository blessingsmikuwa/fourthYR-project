import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const TeacherDashboard = () => {
  const [userData, setUserData]  = useState(null);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes]    = useState([]);
  const [teacherStats, setStats] = useState(null);
  const [loading, setLoading]    = useState(true);

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, resourcesRes, quizzesRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/profiles/me`,           { headers }),
          fetch(`${API_BASE}/resources`,             { headers }),
          fetch(`${API_BASE}/quizzes/mine`,          { headers }),
          fetch(`${API_BASE}/quizzes/teacher/stats`, { headers }),
        ]);

        if (profileRes.ok) setUserData(await profileRes.json());

        if (resourcesRes.ok) {
          const data = await resourcesRes.json();
          const arr  = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
          const user = (() => { try { return JSON.parse(localStorage.getItem("user")) } catch { return {} } })();
          setResources(arr.filter((r) => r.uploaderId == user?.id).slice(0, 3));
        }

        if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
        if (statsRes.ok)   setStats(await statsRes.json());

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const displayName   = userData ? `${userData.firstName} ${userData.lastName}` : "Teacher";
  const displaySchool = userData?.school?.name ?? "";

  const stats = [
    { number: resources.length,                                 label: "Materials Uploaded", icon: "📚" },
    { number: quizzes.length,                                   label: "Quizzes Created",    icon: "📝" },
    { number: teacherStats?.totalStudents ?? "—",               label: "Total Students",     icon: "👥" },
    { number: teacherStats ? `${teacherStats.avgScore}%` : "—", label: "Avg Class Score",   icon: "📊" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#2ea043] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#8b949e]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Welcome Banner ── */}
        <div className="bg-[#1a3a2a] border border-[#2ea043] rounded-lg p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Welcome back, {displayName}!
              </h1>
              {displaySchool && (
                <p className="text-gray-300 text-sm">📍 {displaySchool}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                to="/create-quiz"
                className="flex-1 sm:flex-none text-center bg-[#e3a525] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#f0b429] transition text-sm"
              >
                ✏️ Create Quiz
              </Link>
              <Link
                to="/upload-material"
                className="flex-1 sm:flex-none text-center bg-gray-700 border border-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition text-sm"
              >
                📤 Upload Material
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-gray-800 p-4 sm:p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-xl sm:text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-xs sm:text-sm text-gray-400 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Student Progress Banner ── */}
        {teacherStats && teacherStats.totalStudents > 0 && (
          <div className="mb-6 bg-[#161b22] border border-[#21262d] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[#2ea043] transition">
            <div>
              <p className="text-sm font-semibold text-[#e6edf3]">📊 Student Progress Overview</p>
              <p className="text-xs text-[#6e7681] mt-0.5">
                {teacherStats.totalStudents} student{teacherStats.totalStudents !== 1 ? "s" : ""} have attempted your quizzes ·{" "}
                Class average:{" "}
                <span className="font-bold text-[#2ea043]">{teacherStats.avgScore}%</span>
              </p>
            </div>
            <Link
              to="/create-quiz?view=progress"
              className="self-start sm:self-auto bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition flex-shrink-0"
            >
              View Progress →
            </Link>
          </div>
        )}

        {/* ── Recent Materials ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">📖 My Recent Materials</h2>
            <Link
              to="/resources"
              className="bg-[#2ea043] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:bg-[#3fb950] transition"
            >
              View All
            </Link>
          </div>

          {resources.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-10 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No materials uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#161b22] border border-gray-800 rounded-lg p-4 sm:p-5 hover:border-[#2ea043] transition flex flex-col"
                >
                  <div className="text-xs font-bold mb-2 text-[#58a6ff]">{r.type}</div>
                  <h3 className="font-semibold text-white mb-3 truncate">{r.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
                    {r.targetClass?.name && <span>📅 {r.targetClass.name}</span>}
                    <span>⬇️ {r.downloadCount ?? 0} downloads</span>
                  </div>
                  {r.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{r.description}</p>
                  )}
                  <button
                    onClick={() => r.fileUrl && window.open(r.fileUrl, "_blank")}
                    className="mt-auto bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition self-start"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Quizzes ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">📊 My Recent Quizzes</h2>
            <Link
              to="/create-quiz"
              className="bg-gray-700 border border-gray-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:border-[#2ea043] transition"
            >
              + Create New
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-10 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No quizzes created yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-white">
                  <div>Title</div>
                  <div>Subject</div>
                  <div>Form</div>
                  <div>Created</div>
                </div>
                {quizzes.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    className="grid grid-cols-4 px-4 py-3.5 border-b border-gray-800 last:border-none hover:bg-[#0d1117] transition text-sm text-gray-400"
                  >
                    <div className="text-white truncate pr-2">{q.title}</div>
                    <div className="truncate pr-2">{q.subject}</div>
                    <div>{q.form}</div>
                    <div>{formatDate(q.createdAt)}</div>
                  </div>
                ))}
                {quizzes.length > 5 && (
                  <div className="px-4 py-3 text-center border-t border-gray-800">
                    <Link to="/create-quiz?view=saved" className="text-sm text-[#58a6ff] hover:underline">
                      View all {quizzes.length} quizzes →
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {quizzes.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    className="bg-[#161b22] border border-gray-800 rounded-lg p-4 hover:border-[#2ea043] transition"
                  >
                    <p className="text-white font-semibold text-sm mb-2 truncate">{q.title}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      {q.subject && <span>📘 {q.subject}</span>}
                      {q.form    && <span>🏫 Form {q.form}</span>}
                      <span>🗓 {formatDate(q.createdAt)}</span>
                    </div>
                  </div>
                ))}
                {quizzes.length > 5 && (
                  <div className="text-center pt-1">
                    <Link to="/create-quiz?view=saved" className="text-sm text-[#58a6ff] hover:underline">
                      View all {quizzes.length} quizzes →
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;