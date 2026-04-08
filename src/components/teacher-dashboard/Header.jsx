import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import useThemeMode from "../../hooks/useThemeMode";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useThemeMode();

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

  const quickAccessItems = [
    { path: "/resources", icon: "📚", label: "Resources" },
    { path: "/my-classes", icon: "🏫", label: "My Classes" },
    { path: "/teaching-materials", icon: "📖", label: "Teaching Materials" },
    { path: "/student-progress", icon: "📊", label: "Student Progress" },
    { path: "/create-quiz", icon: "✏️", label: "Create Quiz" },
    { path: "/upload-material", icon: "📤", label: "Upload Material" },
  ];

  return (
    <header className="bg-surface border-b border-app sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Edulib Logo"
            className="h-10 w-10"
          />
          <span className="text-app font-bold text-lg">Edulib</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            to={isTeacher ? "/teacher" : "/student"}
            className={`transition-colors font-medium text-sm ${
              isActive(isTeacher ? '/teacher' : '/student')
                ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                : 'text-app hover:text-[#2ea043]'
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
                    : 'text-app hover:text-[#2ea043]'
                }`}
              >
                Books
              </Link>
              <Link
                to="/past-papers"
                className={`transition-colors font-medium text-sm ${
                  isActive('/past-papers')
                    ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                    : 'text-app hover:text-[#2ea043]'
                }`}
              >
                Past Papers
              </Link>
              <Link
                to="/quizzes"
                className={`transition-colors font-medium text-sm ${
                  isActive('/quizzes')
                    ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                    : 'text-app hover:text-[#2ea043]'
                }`}
              >
                Quizzes
              </Link>
            </>
          )}
        </nav>

        {/* Right Side - Theme toggle, Quick Access & Profile */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[#2ea043] text-[var(--app-text)] hover:bg-[#2ea043]/10 transition-colors"
            title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          {/* Quick Access Dropdown - Only for Teachers */}
          {isTeacher && (
            <div className="relative quick-access-dropdown">
              <button
                onClick={toggleQuickAccess}
                className="flex items-center gap-2 bg-[#21262d] hover:bg-[#2ea043] transition-colors px-3 py-1.5 rounded-md text-sm font-medium text-app"
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
                <div className="absolute right-0 mt-2 w-64 bg-surface border border-app rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-app">
                      <p className="text-xs text-[#e3a525] font-semibold">⚡ QUICK ACCESS</p>
                      <p className="text-xs text-muted">Jump to important sections</p>
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
              className="flex items-center gap-2 text-app hover:text-[#2ea043] transition-colors"
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
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-app rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-app">
                    <p className="text-sm text-app font-medium">{userType} Account</p>
                    <p className="text-xs text-muted">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-app hover:bg-[var(--app-bg)] transition-colors flex items-center gap-2"
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