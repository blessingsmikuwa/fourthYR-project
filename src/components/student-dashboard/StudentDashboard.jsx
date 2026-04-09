import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats]       = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, statsRes, activityRes] = await Promise.all([
          fetch(`${API_BASE}/profiles/me`,        { headers }),
          fetch(`${API_BASE}/activity/me/stats`,  { headers }),
          fetch(`${API_BASE}/activity/me`,        { headers }),
        ]);

        if (profileRes.ok)  setUserData(await profileRes.json());
        if (statsRes.ok)    setStats(await statsRes.json());
        if (activityRes.ok) setActivity(await activityRes.json());

      } catch (err) {
        setError("Failed to load dashboard data.");
        // Fallback to localStorage
        try {
          const stored = JSON.parse(localStorage.getItem("user"));
          if (stored) setUserData(stored);
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const displayName = userData?.firstName ?? "Student";
  const displaySchool = userData?.school?.name ?? "";

  const statCards = [
    { number: stats?.downloads    ?? "—", label: "Downloads" },
    { number: stats?.quizzesCount ?? "—", label: "Quizzes Completed" },
    { number: stats?.pastPapers   ?? "—", label: "Resources Viewed" },
    { number: stats ? `${stats.averageScore}%` : "—", label: "Average Quiz Score" },
  ];

  const formatActivity = (item) => {
    const time = new Date(item.createdAt).toLocaleString("en-GB", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
    switch (item.action) {
      case "DOWNLOAD":
        return { text: `Downloaded "${item.resourceTitle ?? 'a resource'}"`, time, dot: "bg-[#2ea043]" };
      case "RESOURCE_VIEWED":
        return { text: `Viewed "${item.resourceTitle ?? 'a resource'}"`, time, dot: "bg-[#388bfd]" };
      case "QUIZ_COMPLETED":
        return {
          text: `Completed ${item.metadata?.subject ?? ""} quiz — ${item.metadata?.topic ?? ""} (${item.metadata?.percentage ?? 0}%)`,
          time, dot: "bg-[#f0883e]",
        };
      default:
        return { text: "Activity recorded", time, dot: "bg-[#6e7681]" };
    }
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

        {error && (
          <div className="mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#3d1f1f', border: '1px solid #f85149', color: '#f85149' }}>
            {error}
          </div>
        )}

        {/* Welcome */}
        <section className="bg-[#2ea043] text-white p-8 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {displayName}!</h1>
          {displaySchool && <p className="opacity-90">{displaySchool}</p>}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div key={i}
              className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition">
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-[#6e7681]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Quick Access */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#e6edf3]">📖 Quick Access</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Books Library",    desc: "Browse textbooks and novels", icon: "📚", link: "/books" },
              { title: "Past Papers",      desc: "Access exam papers",          icon: "📝", link: "/past-papers" },
              { title: "Practice Quizzes", desc: "Test your knowledge",         icon: "✏️", link: "/quizzes" },
              { title: "Study Materials",  desc: "Notes and worksheets",        icon: "🎓", link: "/materials" },
            ].map((item, i) => (
              <Link key={i} to={item.link}
                className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2ea043] hover:-translate-y-1 transition cursor-pointer block">
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

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#e6edf3]">🕐 Recent Activity</h2>
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg">
            {activity.length === 0 ? (
              <div className="p-6 text-center text-[#6e7681] text-sm">
                No activity yet. Start by downloading a resource or taking a quiz!
              </div>
            ) : (
              activity.slice(0, 10).map((item, i) => {
                const { text, time, dot } = formatActivity(item);
                return (
                  <div key={item.id ?? i}
                    className="flex items-start gap-3 p-4 border-b border-[#21262d] last:border-none hover:bg-[#0d1117] transition">
                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${dot}`} />
                    <div className="flex-1">
                      <div className="text-sm text-[#8b949e]">{text}</div>
                      <div className="text-xs text-[#6e7681] mt-0.5">{time}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default StudentDashboard;