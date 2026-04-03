import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { StudentDashboard } from './components/Student/StudentDashboard';
import './App.css';

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
    <div className="home-container">
      <div className="home-content">
        <h1>📚 E-Learning Management System</h1>
        <p>Digitizing education with interactive learning modules and assessments</p>
        <div className="home-buttons">
          <a href="/login" className="btn btn-primary">
            Login
          </a>
          <a href="/register" className="btn btn-secondary">
            Register
          </a>
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
