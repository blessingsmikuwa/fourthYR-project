import React from "react";
import Header from "./student-dashboard/header";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-app text-app transition-colors duration-300 overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;