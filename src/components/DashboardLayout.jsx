import React from "react";
import Header from "./student-dashboard/header";
import Footer from "./Footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-app text-app transition-colors duration-300">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;