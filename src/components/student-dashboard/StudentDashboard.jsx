import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const StudentDashboard = () => {
  const [userData, setUserData]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // Static stats — quiz/download history not yet available from backend
  const stats = [
    { number: "12",  label: "Books Read" },
    { number: "0",   label: "Quizzes Completed" },
    { number: "24",  label: "Past Papers Accessed" },
    { number: "0%",  label: "Average Score" },
  ]

  const recentActivity = [
    "Downloaded Biology Textbook",
    "Accessed Math Past Paper",
    "Completed English Quiz",
    "Viewed Chemistry Notes",
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${API_BASE}/profiles/me`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!res.ok) throw new Error("Failed to load profile")
        const data = await res.json()
        setUserData(data)
      } catch (err) {
        setError(err.message)
        // Fallback to localStorage user if API fails
        try {
          const stored = JSON.parse(localStorage.getItem("user"))
          if (stored) setUserData(stored)
        } catch {}
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const displayName = userData?.firstName ?? "Student"
  const displayForm = userData?.school?.name ?? "School"

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6 flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <main className="max-w-6xl mx-auto p-4">

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#3d1f1f', border: '1px solid #f85149', color: '#f85149' }}>
            {error}
          </div>
        )}

        {/* Welcome */}
        <section className="bg-[#2ea043] text-white p-8 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {displayName}!
          </h1>
          <p className="opacity-90">{displayForm}</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
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

        {/* Recent Activity — static */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#e6edf3]">🕐 Recent Activity</h2>
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg">
            {recentActivity.map((activity, i) => (
              <div key={i}
                className="p-4 border-b border-[#21262d] last:border-none hover:bg-[#0d1117] transition text-[#8b949e]">
                {activity}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default StudentDashboard