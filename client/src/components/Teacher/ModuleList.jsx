import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { QuizCreate } from './QuizCreate';

export const ModuleList = ({ modules, isTeacher }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(null);
  const { getQuizzesByModule } = useApp();

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="module-list">
      {modules.length === 0 ? (
        <div className="empty-state">
          <p>No modules found. {isTeacher && 'Create your first module!'}</p>
        </div>
      ) : (
        modules.map((module) => {
          const moduleQuizzes = getQuizzesByModule(module.id);
          return (
            <div key={module.id} className="module-card">
              <div
                className="module-header"
                onClick={() => toggleModule(module.id)}
              >
                <div className="module-info">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <span className="module-meta">
                    Created: {module.createdAt} | Students: {module.assignedTo.length}
                  </span>
                </div>
                <span className="expand-icon">
                  {expandedModule === module.id ? '▼' : '▶'}
                </span>
              </div>

              {expandedModule === module.id && (
                <div className="module-content">
                  <div className="content-body">
                    <h4>Content:</h4>
                    <p>{module.content}</p>
                  </div>

                  <div className="quizzes-section">
                    <h4>Quizzes ({moduleQuizzes.length})</h4>
                    {moduleQuizzes.length === 0 ? (
                      <p className="no-quizzes">No quizzes for this module</p>
                    ) : (
                      <ul>
                        {moduleQuizzes.map((quiz) => (
                          <li key={quiz.id}>{quiz.title}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {isTeacher && (
                    <div className="module-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => setShowQuizModal(module.id)}
                      >
                        + Add Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}

              {showQuizModal === module.id && (
                <div
                  className="modal-overlay"
                  onClick={() => setShowQuizModal(null)}
                >
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="modal-close"
                      onClick={() => setShowQuizModal(null)}
                    >
                      ✕
                    </button>
                    <QuizCreate moduleId={module.id} />
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
