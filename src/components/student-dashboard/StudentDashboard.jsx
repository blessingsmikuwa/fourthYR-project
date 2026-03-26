 import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuizHistory } from "../../hooks/useQuizHistory";

const StudentDashboard = () => {
  // Example: Backend-ready state structure
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getQuizStats } = useQuizHistory();

  // Example: Backend integration would look like this
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get quiz stats from the hook
        const quizStats = getQuizStats();

        setUserData({
          name: "Thokozani",
          form: "Form 3",
          school: "Zomba Secondary School"
        });

        setStats([
          { number: "12", label: "Books Read" },
          { number: quizStats.totalQuizzes.toString(), label: "Quizzes Completed" },
          { number: "24", label: "Past Papers Accessed" },
          { number: `${quizStats.averageScore}%`, label: "Average Score" },
        ]);

        // Generate recent activity from quiz history
        const recentQuizActivity = quizStats.recentQuizzes.slice(0, 2).map(quiz =>
          `Completed ${quiz.subject} Quiz - Score ${quiz.score}/${quiz.totalQuestions}`
        );

        setRecentActivity([
          ...recentQuizActivity,
          "Downloaded Biology Textbook",
          "Accessed Math Past Paper",
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
                link: "/books",
              },
              {
                title: "Past Papers",
                desc: "Access exam papers",
                icon: "📝",
                link: "/past-papers",
              },
              {
                title: "Practice Quizzes",
                desc: "Test your knowledge",
                icon: "✏️",
                link: "/quizzes",
              },
              {
                title: "Study Materials",
                desc: "Notes and worksheets",
                icon: "🎓",
                link: "/materials",
              },
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
                  <h3 className="font-semibold text-[#e6edf3] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#6e7681]">
                    {item.desc}
                  </p>
                </div>
              </Link>
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
      </main>
    </div>
  );
};

export default StudentDashboard;