import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#161b22] border-b border-[#21262d] sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo  */}
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
            to="/student"
            className={`transition-colors font-medium text-sm ${
              isActive('/student')
                ? 'text-[#2ea043] border-b-2 border-[#2ea043]'
                : 'text-[#e6edf3] hover:text-[#2ea043]'
            }`}
          >
            Home
          </Link>
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
        </nav>

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
    </header>
  );
};

export default Header;

