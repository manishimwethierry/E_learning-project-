import React from 'react';
import { useApp } from '../../contexts/AppContext';

export const StudentProgressDashboard = ({ studentId }) => {
  const { getStudentModules, getStudentProgress } = useApp();
  const modules = getStudentModules(studentId);
  const studentProgress = getStudentProgress(studentId);

  const completedModules = modules.filter(
    (m) => studentProgress.moduleProgress[m.id]?.status === 'completed'
  ).length;

  const totalProgress = modules.length
    ? Math.round(
        modules.reduce((sum, m) => {
          return sum + (studentProgress.moduleProgress[m.id]?.percentComplete || 0);
        }, 0) / modules.length
      )
    : 0;

  const completedQuizzes = Object.keys(studentProgress.quizScores).length;
  const averageScore =
    completedQuizzes > 0
      ? Math.round(
          Object.values(studentProgress.quizScores).reduce((sum, q) => sum + q.score, 0) /
            completedQuizzes
        )
      : 0;

  return (
    <div className="progress-dashboard">
      <div className="progress-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{modules.length}</h3>
            <p>Total Modules</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>{completedModules}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{completedQuizzes}</h3>
            <p>Quizzes Taken</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{averageScore}%</h3>
            <p>Average Quiz Score</p>
          </div>
        </div>
      </div>

      <div className="overall-progress">
        <h3>Overall Progress</h3>
        <div className="progress-bar-large">
          <div
            className="progress-fill-large"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
        <p className="progress-text">{totalProgress}% Complete</p>
      </div>

      <div className="module-progress-list">
        <h3>Module Progress</h3>
        {modules.length === 0 ? (
          <div className="empty-state">
            <p>No modules assigned yet</p>
          </div>
        ) : (
          modules.map((module) => {
            const moduleProgress =
              studentProgress.moduleProgress[module.id] || {
                percentComplete: 0,
                status: 'not-started',
              };
            return (
              <div key={module.id} className="progress-item">
                <div className="progress-item-info">
                  <h4>{module.title}</h4>
                  <p className="module-description">{module.description}</p>
                </div>
                <div className="progress-item-bar">
                  <div
                    className="progress-bar-mini"
                    style={{ width: `${moduleProgress.percentComplete}%` }}
                  ></div>
                </div>
                <div className="progress-stats-mini">
                  <span>{moduleProgress.percentComplete}%</span>
                  <span className={`status ${moduleProgress.status}`}>
                    {moduleProgress.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
