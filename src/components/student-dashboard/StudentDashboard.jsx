 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  // Example: Backend-ready state structure
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example: Backend integration would look like this
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // const userResponse = await fetch('/api/user/profile');
        // const statsResponse = await fetch('/api/student/stats');
        // const activityResponse = await fetch('/api/student/activity');

        // For now, using dummy data - replace with actual API calls
        setUserData({
          name: "Thokozani",
          form: "Form 3",
          school: "Zomba Secondary School"
        });

        setStats([
          { number: "12", label: "Books Read" },
          { number: "8", label: "Quizzes Completed" },
          { number: "24", label: "Past Papers Accessed" },
          { number: "85%", label: "Average Score" },
        ]);

        setRecentActivity([
          "Completed Chemistry Quiz - Score 18/20",
          "Downloaded Biology Textbook",
          "Accessed Math Past Paper",
          "Completed English Quiz - Score 16/20",
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        {/* WELCOME */}
        <section className="bg-[#2ea043] text-white p-8 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {userData?.name || 'Student'}!
          </h1>
          <p className="opacity-90">
            {userData?.form || 'Form'} | {userData?.school || 'School'}
          </p>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl font-bold text-[#2ea043]">
                {stat.number}
              </div>
              <div className="text-sm text-[#6e7681]">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* QUICK ACCESS */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-[#e6edf3]">
            📖 Quick Access
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Books Library",
                desc: "Browse textbooks and novels",
                icon: "📚",
              },
              {
                title: "Past Papers",
                desc: "Access exam papers",
                icon: "📝",
              },
              {
                title: "Practice Quizzes",
                desc: "Test your knowledge",
                icon: "✏️",
              },
              {
                title: "Study Materials",
                desc: "Notes and worksheets",
                icon: "🎓",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2ea043] hover:-translate-y-1 transition cursor-pointer"
              >
                <div className="h-28 flex items-center justify-center text-3xl bg-[#0d1117]">
                  {item.icon}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-[#e6edf3] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6e7681]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVITY */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#e6edf3]">
            🕐 Recent Activity
          </h2>

          <div className="bg-[#161b22] border border-[#21262d] rounded-lg">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="p-4 border-b border-[#21262d] last:border-none hover:bg-[#0d1117] transition text-[#8b949e]"
              >
                {activity}
              </div>
            ))}
          </div>
        </section>
        
        {/* FOOTER */}
        <footer className="bg-[#161b22] text-[#6e7681] text-center py-6 mt-10">
          <p className="opacity-90">
            © 2026 Malawi School Library System
          </p>
        </footer>
      </main>
      </div>
  );
};

export default StudentDashboard;