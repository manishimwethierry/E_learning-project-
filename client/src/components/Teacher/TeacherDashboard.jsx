import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { ModuleUpload } from './ModuleUpload';
import { ModuleList } from './ModuleList';
import { StudentProgress } from './StudentProgress';
import './Teacher.css';

export const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { getTeacherModules } = useApp();
  const [activeTab, setActiveTab] = useState('modules');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const teacherModules = getTeacherModules(user.id);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h1>📚 E-Learning Platform</h1>
          <span className="role-badge">Teacher</span>
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
              onClick={() => setActiveTab('modules')}
            >
              📖 My Modules
            </button>
            <button
              className={`menu-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              📊 Student Progress
            </button>
            <button
              className={`menu-item ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              ⬆️ Upload Module
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {activeTab === 'modules' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>My Modules</h2>
                <button
                  className="btn-primary"
                  onClick={() => setShowUploadModal(true)}
                >
                  + New Module
                </button>
              </div>
              <ModuleList modules={teacherModules} isTeacher={true} />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="tab-content">
              <h2>Student Progress</h2>
              <StudentProgress teacherId={user.id} />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="tab-content">
              <h2>Upload New Module</h2>
              <ModuleUpload teacherId={user.id} onSuccess={() => setActiveTab('modules')} />
            </div>
          )}
        </main>
      </div>

      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowUploadModal(false)}
            >
              ✕
            </button>
            <ModuleUpload
              teacherId={user.id}
              onSuccess={() => {
                setShowUploadModal(false);
                setActiveTab('modules');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
