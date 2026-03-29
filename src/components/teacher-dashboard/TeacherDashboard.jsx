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
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back, {userData?.name || "Teacher"}!
              </h1>
              <p className="text-gray-300 text-sm">
                {userData?.role || "Teacher"} | {userData?.school || "School"}
              </p>
            </div>
            <div className="flex gap-3">
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

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-gray-800 p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* TEACHING MATERIALS */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">📖 My Teaching Materials</h2>
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

          <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-white">
              <div>Student Name</div>
              <div>Quiz</div>
              <div>Form</div>
              <div>Score</div>
              <div>Date</div>
            </div>

            {recentQuizResults.map((result, i) => {
              const scoreStyle = getScoreColor(result.score, result.total);
              return (
                <div
                  key={i}
                  className="grid grid-cols-5 px-4 py-4 border-b border-gray-800 last:border-none hover:bg-[#0d1117] transition text-sm text-gray-400"
                >
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
    </div>
  );
};

export default TeacherDashboard;