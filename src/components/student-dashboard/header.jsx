import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import useThemeMode from "../../hooks/useThemeMode";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen]         = useState(false);
  const [isQuickAccessOpen, setIsQuickAccessOpen] = useState(false);
  const [isBooksMenuOpen, setIsBooksMenuOpen]     = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false);
  const { toggleTheme, isDark } = useThemeMode();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) ?? {} }
    catch { return {} }
  })();

  // ── FIXED: role only, no path guessing ──
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";

  const userType  = isTeacher ? 'Teacher' : 'Student';
  const userEmail = user.email ?? (isTeacher ? 'teacher@edulib.com' : 'student@edulib.com');
  const userName  = user.firstName ? `${user.firstName} ${user.lastName}` : userType;
  const initials  = user.firstName ? user.firstName[0].toUpperCase() : (isTeacher ? 'T' : 'S');

  const isActive = (path) => {
    if (path === '/books') return ['/books', '/books/premium'].includes(location.pathname);
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsQuickAccessOpen(false);
    setIsBooksMenuOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown'))        setIsProfileOpen(false);
      if (!event.target.closest('.quick-access-dropdown'))   setIsQuickAccessOpen(false);
      if (!event.target.closest('.books-dropdown'))          setIsBooksMenuOpen(false);
      if (
        !event.target.closest('.mobile-menu-panel') &&
        !event.target.closest('.mobile-menu-btn')
      ) setIsMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickAccessItems = [
    { path: "/resources",        icon: "📚", label: "Resources" },
    { path: "/my-classes",       icon: "🏫", label: "My Classes" },
    { path: "/student-progress", icon: "📊", label: "Student Progress" },
    { path: "/create-quiz",      icon: "✏️",  label: "Create Quiz" },
    { path: "/upload-material",  icon: "📤", label: "Upload Material" },
  ];

  const linkCls = (path) =>
    `transition-colors font-medium text-sm pb-0.5 ${
      isActive(path)
        ? "text-[#2ea043] border-b-2 border-[#2ea043]"
        : "text-app hover:text-[#2ea043]"
    }`;

  const mobileLinkCls = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-[#1a3a2a] text-[#2ea043]"
        : "text-app hover:bg-[#21262d] hover:text-[#2ea043]"
    }`;

  return (
    <header className="bg-surface border-b border-app sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to={isTeacher ? "/teacher" : "/student"} className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="Edulib Logo" className="h-9 w-9" />
            <span className="text-app font-bold text-lg">Edulib</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-7">
            {isTeacher ? (
              <>
                <Link to="/teacher"          className={linkCls('/teacher')}>Dashboard</Link>
                <Link to="/resources"        className={linkCls('/resources')}>Resources</Link>
                <Link to="/my-classes"       className={linkCls('/my-classes')}>My Classes</Link>
                <Link to="/structured-tests" className={linkCls('/structured-tests')}>Structured Tests</Link>
              </>
            ) : (
              <>
                <Link to="/student" className={linkCls('/student')}>Home</Link>

                {/* Books dropdown */}
                <div className="relative books-dropdown">
                  <button
                    onMouseEnter={() => setIsBooksMenuOpen(true)}
                    onMouseLeave={() => setIsBooksMenuOpen(false)}
                    onClick={() => navigate('/books')}
                    className={`inline-flex items-center gap-1 font-medium text-sm transition-colors pb-0.5 ${
                      isActive('/books') ? 'text-[#2ea043] border-b-2 border-[#2ea043]' : 'text-app hover:text-[#2ea043]'
                    }`}
                  >
                    Books
                    <svg className={`w-3.5 h-3.5 transition-transform ${isBooksMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isBooksMenuOpen && (
                    <div
                      className="absolute left-0 top-full mt-1 w-44 rounded-lg border border-[#21262d] bg-surface shadow-xl z-50 py-1"
                      onMouseEnter={() => setIsBooksMenuOpen(true)}
                      onMouseLeave={() => setIsBooksMenuOpen(false)}
                    >
                      <Link to="/books"         onClick={() => setIsBooksMenuOpen(false)} className="block px-4 py-2 text-sm text-app hover:bg-[#21262d] hover:text-[#2ea043] transition-colors">Free Books</Link>
                      <Link to="/books/premium" onClick={() => setIsBooksMenuOpen(false)} className="block px-4 py-2 text-sm text-app hover:bg-[#21262d] hover:text-[#2ea043] transition-colors">Premium Books</Link>
                    </div>
                  )}
                </div>

                <Link to="/past-papers"      className={linkCls('/past-papers')}>Past Papers</Link>
                <Link to="/quizzes"          className={linkCls('/quizzes')}>Quizzes</Link>
                <Link to="/structured-tests" className={linkCls('/structured-tests')}>Tests</Link>
              </>
            )}
          </nav>

          {/* ── Desktop Right ── */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#30363d] text-app hover:border-[#2ea043] hover:bg-[#2ea043]/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Quick Access — teacher only */}
            {isTeacher && (
              <div className="relative quick-access-dropdown">
                <button
                  onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
                  className="flex items-center gap-1.5 bg-[#2ea043] hover:bg-[#3fb950] transition px-3 py-1.5 rounded-md text-sm font-medium text-white"
                >
                  <span>⚡</span>
                  <span>Quick Access</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${isQuickAccessOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isQuickAccessOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-surface border border-app rounded-lg shadow-xl z-50">
                    <div className="px-4 py-2.5 border-b border-app">
                      <p className="text-xs text-[#e3a525] font-semibold">⚡ QUICK ACCESS</p>
                      <p className="text-xs text-muted">Jump to important sections</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {quickAccessItems.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => { navigate(item.path); setIsQuickAccessOpen(false); }}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-app hover:bg-[#21262d] hover:text-[#2ea043] rounded-md transition"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-app hover:text-[#2ea043] transition rounded-md px-2 py-1 hover:bg-[#21262d]"
              >
                <div className="w-8 h-8 bg-[#2ea043] rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {initials}
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{userName}</span>
                <svg className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-app rounded-lg shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-app">
                    <p className="text-sm text-app font-medium">{userType} Account</p>
                    <p className="text-xs text-muted truncate">{userEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-app hover:bg-[#21262d] transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile Right ── */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-[#30363d] text-app hover:border-[#2ea043] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div className="w-8 h-8 bg-[#2ea043] rounded-full flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
            <button
              type="button"
              className="mobile-menu-btn flex items-center justify-center w-9 h-9 rounded-md border border-[#30363d] text-app hover:border-[#2ea043] hover:bg-[#21262d] transition-colors"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Menu Panel ── */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-panel lg:hidden border-t border-app bg-surface shadow-xl">
          <div className="max-w-screen-2xl mx-auto px-4 py-3 space-y-1">

            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-app">
              <div className="w-10 h-10 bg-[#2ea043] rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-app truncate">{userName}</p>
                <p className="text-xs text-muted truncate">{userEmail}</p>
              </div>
            </div>

            {/* Nav links */}
            {isTeacher ? (
              <>
                <Link to="/teacher"          onClick={closeAll} className={mobileLinkCls('/teacher')}>🏠 Dashboard</Link>
                <Link to="/resources"        onClick={closeAll} className={mobileLinkCls('/resources')}>📚 Resources</Link>
                <Link to="/my-classes"       onClick={closeAll} className={mobileLinkCls('/my-classes')}>🏫 My Classes</Link>
                <Link to="/structured-tests" onClick={closeAll} className={mobileLinkCls('/structured-tests')}>📝 Structured Tests</Link>

                {/* Quick Access */}
                <div className="pt-2 mt-1 border-t border-app">
                  <p className="px-3 pb-1 text-xs font-semibold text-[#e3a525] uppercase tracking-wide">⚡ Quick Access</p>
                  {quickAccessItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); closeAll(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-app hover:bg-[#21262d] hover:text-[#2ea043] transition-colors"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Link to="/student"          onClick={closeAll} className={mobileLinkCls('/student')}>🏠 Home</Link>
                <Link to="/books"            onClick={closeAll} className={mobileLinkCls('/books')}>📖 Free Books</Link>
                <Link to="/books/premium"    onClick={closeAll} className={mobileLinkCls('/books/premium')}>⭐ Premium Books</Link>
                <Link to="/past-papers"      onClick={closeAll} className={mobileLinkCls('/past-papers')}>📄 Past Papers</Link>
                <Link to="/quizzes"          onClick={closeAll} className={mobileLinkCls('/quizzes')}>📝 Quizzes</Link>
                <Link to="/structured-tests" onClick={closeAll} className={mobileLinkCls('/structured-tests')}>🗒️ Tests</Link>
              </>
            )}

            {/* Logout */}
            <div className="pt-2 mt-1 border-t border-app">
              <button
                onClick={() => { handleLogout(); closeAll(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-[#f85149] hover:bg-[#3d1a1a] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;