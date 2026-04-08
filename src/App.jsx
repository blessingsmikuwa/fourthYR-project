 import { BrowserRouter, Routes, Route } from "react-router-dom";
import useThemeMode from "./hooks/useThemeMode";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/student-dashboard/StudentDashboard";
import TeacherDashboard from "./components/teacher-dashboard/TeacherDashboard";
import Books from "./components/student-dashboard/books.jsx";
import Quiz from "./components/student-dashboard/quizzes.jsx";
import PastPapers from "./components/student-dashboard/past-papers.jsx";
import DashboardLayout from "./components/DashboardLayout";
import Resources from "./components/teacher-dashboard/Resources.jsx"
import CreateQuiz from "./components/teacher-dashboard/CreateQuiz.jsx";
import MyClasses from "./components/teacher-dashboard/MyClasses.jsx";
import StudentProgress from "./components/teacher-dashboard/StudentProgress.jsx";


function App() {
  useThemeMode();

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
         <Route path="/past-papers" element={<DashboardLayout><PastPapers /></DashboardLayout>} />
         <Route path="/teacher" element={<DashboardLayout><TeacherDashboard /></DashboardLayout>} />
         <Route path="/resources" element={<DashboardLayout><Resources /></DashboardLayout>} />
          <Route path="/create-quiz" element={<DashboardLayout><CreateQuiz /></DashboardLayout>} />
          <Route path="/my-classes" element={<DashboardLayout><MyClasses /></DashboardLayout>} />
          <Route path="/student-progress" element={<DashboardLayout><StudentProgress /></DashboardLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;