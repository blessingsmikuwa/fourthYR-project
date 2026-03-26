import React from "react";
import Footer from "../Footer";

const TeacherDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#e6edf3]">
      <main className="flex-1 p-6">
        {/* HEADER */}
        <h1 className="text-2xl font-semibold mb-6">
          Teacher Dashboard
        </h1>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherDashboard;