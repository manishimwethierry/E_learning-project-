
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} replace />;
  }

  return children;
};

// Home/Landing Page Component
const Home = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">[📚 E-Learning]</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-white hover:text-cyan-200 px-3 py-2 rounded-md text-sm font-medium transition">Home</a>
                <a href="#" className="text-white hover:text-cyan-200 px-3 py-2 rounded-md text-sm font-medium transition">Courses</a>
                <a href="#" className="text-white hover:text-cyan-200 px-3 py-2 rounded-md text-sm font-medium transition">About</a>
                <a href="#" className="text-white hover:text-cyan-200 px-3 py-2 rounded-md text-sm font-medium transition">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">📚 E-Learning Management System</h1>
            <p className="mt-4 text-slate-600 text-lg md:text-xl">Digitizing education with interactive learning modules, progress tracking, and assessments.</p>
            <p className="mt-2 text-slate-500">Start with Login or Register to unlock your personalized dashboard.</p>


              >
                Login
              </a>
              <a
                href="/register"
                className="px-8 py-3 rounded-xl text-indigo-700 font-semibold bg-white border border-indigo-300 hover:bg-indigo-50 transition"
              >
                Register
              </a>
            </div>
                <p>   Welcome to our e-learning platform! <br />
                    <span className="text-black">Created by Manishimwe Thierry</span>
                </p> 
            </div>
          </div>
        </div>
      </div>
  
  );
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
