import React from "react";
import Header from "./student-dashboard/header";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default DashboardLayout;