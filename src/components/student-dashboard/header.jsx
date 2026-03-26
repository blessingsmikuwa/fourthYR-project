import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

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
      </div>
    </header>
  );
};

export default Header;

