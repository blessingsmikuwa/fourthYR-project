<<<<<<< Updated upstream
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
=======
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiBook, 
  FiFileText, 
  FiUsers, 
  FiBarChart2, 
  FiEdit, 
  FiUpload, 
  FiArrowRight,
  FiDownload,
  FiCalendar,
  FiPlus,
  FiEye
} from "react-icons/fi";
import { 
  MdOutlineLibraryBooks, 
  MdOutlineQuiz, 
  MdOutlinePeople, 
  MdOutlineInsights,
  MdLocationOn,
  MdOutlineAddCircle
} from "react-icons/md";
import { FaChalkboardTeacher, FaBookOpen, FaUserGraduate } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { BiTrendingUp } from "react-icons/bi";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);

  const isTeacher = location.pathname.startsWith('/teacher');
  const userType = isTeacher ? 'Teacher' : 'Student';
  const userEmail = isTeacher ? 'teacher@edulib.com' : 'student@edulib.com';

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.clear();
    // Navigate to login page
    navigate('/');
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleQuickAccess = () => {
    setIsQuickAccessOpen(!isQuickAccessOpen);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
      if (!event.target.closest('.quick-access-dropdown')) {
        setIsQuickAccessOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

<<<<<<< Updated upstream
  const quickAccessItems = [
    { path: "/resources", icon: "📚", label: "Resources" },
    { path: "/my-classes", icon: "🏫", label: "My Classes" },
    { path: "/teaching-materials", icon: "📖", label: "Teaching Materials" },
    { path: "/student-progress", icon: "📊", label: "Student Progress" },
    { path: "/create-quiz", icon: "✏️", label: "Create Quiz" },
    { path: "/upload-material", icon: "📤", label: "Upload Material" },
=======
  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const displayName   = userData ? `${userData.firstName} ${userData.lastName}` : "Teacher";
  const displaySchool = userData?.school?.name ?? "";

  const stats = [
    { number: resources.length,                                 label: "Materials Uploaded", icon: <MdOutlineLibraryBooks size={24} /> },
    { number: quizzes.length,                                   label: "Quizzes Created",    icon: <MdOutlineQuiz size={24} /> },
    { number: teacherStats?.totalStudents ?? "—",               label: "Total Students",     icon: <MdOutlinePeople size={24} /> },
    { number: teacherStats ? `${teacherStats.avgScore}%` : "—", label: "Avg Class Score",   icon: <IoStatsChart size={24} /> },
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  ];

  return (
<<<<<<< Updated upstream
    <header className="bg-[#161b22] border-b border-[#21262d] sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Edulib Logo"
            className="h-10 w-10"
          />
          <span className="text-[#e6edf3] font-bold text-lg">Edulib</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to={isTeacher ? "/teacher" : "/student"}
            className={`transition-colors font-medium text-sm ${
              isActive(isTeacher ? '/teacher' : '/student')
                ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                : 'text-[#e6edf3] hover:text-[#2ea043]'
            }`}
          >
            Home
          </Link>
          {!isTeacher && (
            <>
              <Link
                to="/books"
                className={`transition-colors font-medium text-sm ${
                  isActive('/books')
                    ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                    : 'text-[#e6edf3] hover:text-[#2ea043]'
                }`}
              >
                Books
              </Link>
              <Link
                to="/past-papers"
                className={`transition-colors font-medium text-sm ${
                  isActive('/past-papers')
                    ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                    : 'text-[#e6edf3] hover:text-[#2ea043]'
                }`}
              >
                Past Papers
              </Link>
              <Link
                to="/quizzes"
                className={`transition-colors font-medium text-sm ${
                  isActive('/quizzes')
                    ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                    : 'text-[#e6edf3] hover:text-[#2ea043]'
                }`}
              >
                Quizzes
              </Link>
=======
    <div className="bg-[#0d1117] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Welcome Banner ── */}
        <div className="bg-[#1a3a2a] border border-[#2ea043] rounded-lg p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <FaChalkboardTeacher /> Welcome back, {displayName}!
              </h1>
              {displaySchool && (
                <p className="text-gray-300 text-sm flex items-center gap-1">
                  <MdLocationOn size={14} /> {displaySchool}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                to="/create-quiz"
                className="flex-1 sm:flex-none text-center bg-[#e3a525] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#f0b429] transition text-sm flex items-center justify-center gap-2"
              >
                <FiEdit size={16} /> Create Quiz
              </Link>
              <Link
                to="/upload-material"
                className="flex-1 sm:flex-none text-center bg-gray-700 border border-gray-600 text-white font-semibold px-4 py-2 rounded-md hover:border-[#2ea043] transition text-sm flex items-center justify-center gap-2"
              >
                <FiUpload size={16} /> Upload Material
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
              <div className="text-[#2ea043] mb-2">{stat.icon}</div>
              <div className="text-xl sm:text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-xs sm:text-sm text-gray-400 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Student Progress Banner ── */}
        {teacherStats && teacherStats.totalStudents > 0 && (
          <div className="mb-6 bg-[#161b22] border border-[#21262d] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-[#2ea043] transition">
            <div>
              <p className="text-sm font-semibold text-[#e6edf3] flex items-center gap-2">
                <BiTrendingUp className="text-[#2ea043]" /> Student Progress Overview
              </p>
              <p className="text-xs text-[#6e7681] mt-0.5">
                <MdOutlinePeople className="inline mr-1" size={12} />
                {teacherStats.totalStudents} student{teacherStats.totalStudents !== 1 ? "s" : ""} have attempted your quizzes ·{" "}
                Class average:{" "}
                <span className="font-bold text-[#2ea043]">{teacherStats.avgScore}%</span>
              </p>
            </div>
            <Link
              to="/create-quiz?view=progress"
              className="self-start sm:self-auto bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#3fb950] transition flex-shrink-0 flex items-center gap-1"
            >
              View Progress <FiArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* ── Recent Materials ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FaBookOpen /> My Recent Materials
            </h2>
            <Link
              to="/resources"
              className="bg-[#2ea043] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:bg-[#3fb950] transition"
            >
              View All
            </Link>
          </div>

          {resources.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-10 text-center text-gray-500">
              <div className="text-4xl mb-3 flex justify-center">
                <MdOutlineLibraryBooks size={48} className="text-gray-600" />
              </div>
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
                  <h3 className="font-semibold text-white mb-3 truncate flex items-center gap-2">
                    <FiBook size={14} /> {r.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
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
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{r.description}</p>
                  )}
                  <button
                    onClick={() => r.fileUrl && window.open(r.fileUrl, "_blank")}
                    className="mt-auto bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition self-start flex items-center gap-1"
                  >
                    <FiEye size={12} /> View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Quizzes ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FiBarChart2 /> My Recent Quizzes
            </h2>
            <Link
              to="/create-quiz"
              className="bg-gray-700 border border-gray-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:border-[#2ea043] transition flex items-center gap-1"
            >
              <FiPlus size={14} /> Create New
            </Link>
          </div>

          {quizzes.length === 0 ? (
            <div className="bg-[#161b22] border border-gray-800 rounded-lg p-10 text-center text-gray-500">
              <div className="text-4xl mb-3 flex justify-center">
                <MdOutlineQuiz size={48} className="text-gray-600" />
              </div>
              <p className="text-sm">No quizzes created yet.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-[#1a3a2a] px-4 py-3 text-sm font-semibold text-white">
                  <div className="flex items-center gap-1"><FiFileText /> Title</div>
                  <div>Subject</div>
                  <div>Form</div>
                  <div>Created</div>
                </div>
                {quizzes.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    className="grid grid-cols-4 px-4 py-3.5 border-b border-gray-800 last:border-none hover:bg-[#0d1117] transition text-sm text-gray-400"
                  >
                    <div className="text-white truncate pr-2 flex items-center gap-2">
                      <MdOutlineQuiz size={14} className="text-[#2ea043]" />
                      {q.title}
                    </div>
                    <div className="truncate pr-2">{q.subject}</div>
                    <div>{q.form}</div>
                    <div className="flex items-center gap-1">
                      <FiCalendar size={12} /> {formatDate(q.createdAt)}
                    </div>
                  </div>
                ))}
                {quizzes.length > 5 && (
                  <div className="px-4 py-3 text-center border-t border-gray-800">
                    <Link to="/create-quiz?view=saved" className="text-sm text-[#58a6ff] hover:underline inline-flex items-center gap-1">
                      View all {quizzes.length} quizzes <FiArrowRight size={12} />
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
                    <p className="text-white font-semibold text-sm mb-2 truncate flex items-center gap-2">
                      <MdOutlineQuiz size={14} className="text-[#2ea043]" />
                      {q.title}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      {q.subject && (
                        <span className="flex items-center gap-1">
                          <FiBook size={12} /> {q.subject}
                        </span>
                      )}
                      {q.form && (
                        <span className="flex items-center gap-1">
                          <FaUserGraduate size={12} /> Form {q.form}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {formatDate(q.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                {quizzes.length > 5 && (
                  <div className="text-center pt-1">
                    <Link to="/create-quiz?view=saved" className="text-sm text-[#58a6ff] hover:underline inline-flex items-center gap-1">
                      View all {quizzes.length} quizzes <FiArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
>>>>>>> Stashed changes
            </>
          )}
        </nav>

        {/* Right Side - Quick Access & Profile */}
        <div className="flex items-center gap-4">
          {/* Quick Access Dropdown - Only for Teachers */}
          {isTeacher && (
            <div className="relative quick-access-dropdown">
              <button
                onClick={toggleQuickAccess}
                className="flex items-center gap-2 bg-[#21262d] hover:bg-[#2ea043] transition-colors px-3 py-1.5 rounded-md text-sm font-medium text-[#e6edf3]"
              >
                <span>⚡</span>
                <span>Quick Access</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isQuickAccessOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Quick Access Dropdown Menu */}
              {isQuickAccessOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#161b22] border border-[#21262d] rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-[#21262d]">
                      <p className="text-xs text-[#e3a525] font-semibold">⚡ QUICK ACCESS</p>
                      <p className="text-xs text-[#6e7681]">Jump to important sections</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {quickAccessItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setIsQuickAccessOpen(false);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] rounded-md transition-colors group"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="group-hover:text-[#2ea043]">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Section */}
          <div className="relative profile-dropdown">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center gap-2 text-[#e6edf3] hover:text-[#2ea043] transition-colors"
            >
              <div className="w-8 h-8 bg-[#2ea043] rounded-full flex items-center justify-center text-sm font-semibold">
                👤
              </div>
              <span className="text-sm font-medium">Profile</span>
              <svg
                className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-[#21262d] rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-[#21262d]">
                    <p className="text-sm text-[#e6edf3] font-medium">{userType} Account</p>
                    <p className="text-xs text-[#6e7681]">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;