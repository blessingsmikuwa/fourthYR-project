 import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/student-dashboard/StudentDashboard";
import TeacherDashboard from "./components/teacher-dashboard/TeacherDashboard";
import Books from "./components/student-dashboard/books.jsx";
import Quiz from "./components/student-dashboard/quizzes.jsx";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
   
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes */}
         <Route path="/student" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
         <Route path="/books" element={<DashboardLayout><Books /></DashboardLayout>} />
         <Route path="/quizzes" element={<DashboardLayout><Quiz /></DashboardLayout>} />
         <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;