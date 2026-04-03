import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { ModuleView } from './ModuleView';
import { StudentModuleList } from './StudentModuleList';
import { StudentProgressDashboard } from './StudentProgressDashboard';
import './Student.css';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { getStudentModules } = useApp();
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedModule, setSelectedModule] = useState(null);

  const studentModules = getStudentModules(user.id);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>📚 E-Learning Platform</h1>
          <span className="role-badge student">Student</span>
        </div>
        <div className="navbar-user">
          <span>{user.name}</span>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'modules' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('modules');
                setSelectedModule(null);
              }}
            >
              📖 My Learning
            </button>
            <button
              className={`menu-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              📊 Progress
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {selectedModule ? (
            <ModuleView
              module={selectedModule}
              studentId={user.id}
              onBack={() => setSelectedModule(null)}
            />
          ) : activeTab === 'modules' ? (
            <div className="tab-content">
              <div className="tab-header">
                <h2>My Modules</h2>
                <span className="module-count">{studentModules.length} modules</span>
              </div>
              <StudentModuleList
                modules={studentModules}
                onSelectModule={setSelectedModule}
              />
            </div>
          ) : (
            <div className="tab-content">
              <h2>My Progress</h2>
              <StudentProgressDashboard studentId={user.id} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
