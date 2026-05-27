import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useThemeMode from "./hooks/useThemeMode";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/student-dashboard/StudentDashboard";
import TeacherDashboard from "./components/teacher-dashboard/TeacherDashboard";
import Books from "./components/student-dashboard/books.jsx";
import Quiz from "./components/student-dashboard/quizzes.jsx";
import PastPapers from "./components/student-dashboard/past-papers.jsx";
import DashboardLayout from "./components/DashboardLayout";
import Resources from "./components/teacher-dashboard/Resources.jsx";
import CreateQuiz from "./components/teacher-dashboard/CreateQuiz.jsx";
import MyClasses from "./components/teacher-dashboard/MyClasses.jsx";
import StudentProgress from "./components/teacher-dashboard/StudentProgress.jsx";
import { refreshAccessToken } from "./components/utils/AuthUtils";
import SchoolRegister from "./components/school/SchoolRegister.jsx";
import PaymentResult from "./components/student-dashboard/PaymentResults.jsx";
import StructuredTests from "./components/teacher-dashboard/StructuredTest.jsx";

// Decodes JWT and returns expiry timestamp in ms
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

// Wrapper that sets up proactive token refresh
function AuthProvider({ children, loginPath = '/' }) {
  const navigate = useNavigate()

  useEffect(() => {
    let timer = null

    const scheduleRefresh = () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const expiry = getTokenExpiry(token)
      if (!expiry) return

      // Refresh 60 seconds before expiry
      const delay = expiry - Date.now() - 60_000

      if (delay <= 0) {
        // Already expired or about to — refresh immediately
        handleRefresh()
        return
      }

      timer = setTimeout(handleRefresh, delay)
    }

    const handleRefresh = async () => {
      const newToken = await refreshAccessToken()
      if (newToken) {
        scheduleRefresh() // Schedule next refresh
      } else {
        // Refresh failed — clear auth and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        navigate(loginPath)
      }
    }

    scheduleRefresh()

    return () => { if (timer) clearTimeout(timer) }
  }, [navigate, loginPath])

  return children
}

function App() {
  useThemeMode()

  return (
    <BrowserRouter>
      <AuthProvider loginPath="/">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/school/register" element={<SchoolRegister />} />
          <Route path="/payment/result" element={<PaymentResult />} />

          {/* Dashboard Routes */}
          <Route path="/student"      element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
          <Route path="/books"        element={<DashboardLayout><Books /></DashboardLayout>} />
          <Route path="/books/premium" element={<DashboardLayout><Books /></DashboardLayout>} />
         <Route path="/quizzes"      element={<DashboardLayout><Quiz /></DashboardLayout>} />
          <Route path="/past-papers"  element={<DashboardLayout><PastPapers /></DashboardLayout>} />
          <Route path="/teacher"      element={<DashboardLayout><TeacherDashboard /></DashboardLayout>} />
          <Route path="/resources"    element={<DashboardLayout><Resources /></DashboardLayout>} />
          <Route path="/create-quiz"  element={<DashboardLayout><CreateQuiz /></DashboardLayout>} />
          <Route path="/my-classes"   element={<DashboardLayout><MyClasses /></DashboardLayout>} />
          <Route path="/student-progress" element={<DashboardLayout><StudentProgress /></DashboardLayout>} />
          <Route path="/structured-tests" element={<DashboardLayout><StructuredTests /></DashboardLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App