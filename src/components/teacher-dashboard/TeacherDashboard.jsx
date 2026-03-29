import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6 flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <main className="max-w-6xl mx-auto p-4">

        {/* WELCOME BANNER */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] text-white p-8 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {userData?.name || "Teacher"}!
            </h1>
            <p className="opacity-80 text-sm">
              {userData?.role || "Teacher"} | {userData?.school || "School"}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/create-quiz"
              className="bg-[#e3a525] text-[#0d1117] font-semibold px-5 py-2 rounded-md hover:bg-[#f0b429] transition text-sm"
            >
              ✏️ Create Quiz
            </Link>
            <Link
              to="/upload-material"
              className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold px-5 py-2 rounded-md hover:border-[#2ea043] transition text-sm"
            >
              📤 Upload Material
            </Link>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-[#6e7681]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* QUICK ACCESS */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#e6edf3]">🗂️ Quick Access</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Teaching Materials", desc: "Upload & manage resources", icon: "📚", link: "/materials" },
              { title: "My Classes", desc: "View and manage classes", icon: "🏫", link: "/classes" },
              { title: "Create Quiz", desc: "Build new assessments", icon: "✏️", link: "/create-quiz" },
              { title: "Student Progress", desc: "Track performance", icon: "📊", link: "/student-progress" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2ea043] hover:-translate-y-1 transition cursor-pointer block"
              >
                <div className="h-28 flex items-center justify-center text-3xl bg-[#0d1117]">
                  {item.icon}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#e6edf3] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#6e7681]">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MY TEACHING MATERIALS */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#e6edf3]">📖 My Teaching Materials</h2>
            <Link
              to="/upload-material"
              className="bg-[#f85149] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#da3633] transition"
            >
              + Add New Material
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teachingMaterials.map((material, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 hover:border-[#2ea043] transition"
              >
                <div
                  className="text-xs font-bold mb-2"
                  style={{ color: material.typeColor }}
                >
                  {material.type}
                </div>
                <h3 className="font-semibold text-[#e6edf3] mb-3">{material.title}</h3>
                <div className="flex gap-4 text-xs text-[#6e7681] mb-3">
                  <span>📅 {material.form}</span>
                  <span>👁 {material.views} views</span>
                  <span>⬇️ {material.downloads} downloads</span>
                </div>
                <p className="text-sm text-[#8b949e] mb-4">{material.description}</p>
                <div className="flex gap-2">
                  <button className="bg-[#f85149] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#da3633] transition">
                    View
                  </button>
                  <button className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs font-semibold px-3 py-1.5 rounded hover:border-[#2ea043] transition">
                    Edit
                  </button>
                  <button className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs px-3 py-1.5 rounded hover:border-[#2ea043] transition">
                    📊
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECENT QUIZ RESULTS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#e6edf3]">📊 Recent Quiz Results</h2>
            <Link
              to="/student-progress"
              className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-sm font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition"
            >
              View All
            </Link>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-[#e6edf3]">
              <span>Student Name</span>
              <span>Quiz</span>
              <span>Form</span>
              <span>Score</span>
              <span>Date</span>
            </div>

            {recentQuizResults.map((result, i) => {
              const scoreStyle = getScoreColor(result.score, result.total);
              return (
                <div
                  key={i}
                  className="grid grid-cols-5 px-4 py-4 border-b border-[#21262d] last:border-none hover:bg-[#0d1117] transition text-sm text-[#8b949e]"
                >
                  <span className="text-[#e6edf3]">{result.student}</span>
                  <span>{result.quiz}</span>
                  <span>{result.form}</span>
                  <span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{ backgroundColor: scoreStyle.bg, color: scoreStyle.color }}
                    >
                      {result.score}/{result.total}
                    </span>
                  </span>
                  <span>{result.date}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;