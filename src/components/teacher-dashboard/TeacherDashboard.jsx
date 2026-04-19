import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const TeacherDashboard = () => {
  const [userData, setUserData]   = useState(null);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes]     = useState([]);
  const [loading, setLoading]     = useState(true);

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, resourcesRes, quizzesRes] = await Promise.all([
          fetch(`${API_BASE}/profiles/me`,   { headers }),
          fetch(`${API_BASE}/resources`,     { headers }),
          fetch(`${API_BASE}/quizzes/mine`,  { headers }),
        ]);

        if (profileRes.ok)   setUserData(await profileRes.json());

        if (resourcesRes.ok) {
          const data = await resourcesRes.json();
          const arr  = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
          // Filter to teacher's own uploads
          const user = (() => { try { return JSON.parse(localStorage.getItem("user")) } catch { return {} } })();
          setResources(arr.filter((r) => r.uploaderId == user?.id).slice(0, 3));
        }

        if (quizzesRes.ok) setQuizzes(await quizzesRes.json());

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getScoreColor = (score, total) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return { bg: "#1a4731", color: "#2ea043" };
    if (pct >= 60) return { bg: "#3d2f0a", color: "#e3a525" };
    return { bg: "#3d1a1a", color: "#f85149" };
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const displayName   = userData ? `${userData.firstName} ${userData.lastName}` : "Teacher";
  const displaySchool = userData?.school?.name ?? "";

  const stats = [
    { number: resources.length, label: "Materials Uploaded" },
    { number: quizzes.length,   label: "Quizzes Created" },
    { number: "—",              label: "Total Students" },
    { number: "—",              label: "Avg Class Score" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="bg-[#1a3a2a] border border-[#2ea043] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {displayName}!</h1>
              {displaySchool && <p className="text-gray-300 text-sm">{displaySchool}</p>}
            </div>
            <div className="flex gap-3">
              <Link to="/create-quiz"
                className="bg-[#e3a525] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#f0b429] transition text-sm">
                ✏️ Create Quiz
              </Link>
              <Link to="/upload-material"
                className="bg-gray-700 border border-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition text-sm">
                📤 Upload Material
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#161b22] border border-gray-800 p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition">
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Materials */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📖 My Recent Materials</h2>
            <Link to="/resources"
              className="bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition">
              View All
            </Link>
          </div>

          {resources.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No materials uploaded yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((r) => (
                <div key={r.id} className="bg-[#161b22] border border-gray-800 rounded-lg p-5 hover:border-[#2ea043] transition">
                  <div className="text-xs font-bold mb-2 text-[#58a6ff]">{r.type}</div>
                  <h3 className="font-semibold text-white mb-3 truncate">{r.title}</h3>
                  <div className="flex gap-4 text-xs text-gray-400 mb-3">
                    {r.targetClass?.name && <span>📅 {r.targetClass.name}</span>}
                    <span>⬇️ {r.downloadCount ?? 0} downloads</span>
                  </div>
                  {r.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{r.description}</p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => r.fileUrl && window.open(r.fileUrl, '_blank')}
                      className="bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📊 My Recent Quizzes</h2>
            <Link to="/create-quiz"
              className="bg-gray-700 border border-gray-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition">
              + Create New
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-12 text-center text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No quizzes created yet.</p>
            </div>
          ) : (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-white">
                <div>Title</div>
                <div>Subject</div>
                <div>Form</div>
                <div>Created</div>
              </div>
              {quizzes.slice(0, 5).map((q) => (
                <div key={q.id}
                  className="grid grid-cols-4 px-4 py-4 border-b border-gray-800 last:border-none hover:bg-[#0d1117] transition text-sm text-gray-400">
                  <div className="text-white truncate">{q.title}</div>
                  <div>{q.subject}</div>
                  <div>{q.form}</div>
                  <div>{formatDate(q.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;