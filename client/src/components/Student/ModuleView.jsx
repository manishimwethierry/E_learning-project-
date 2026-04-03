import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { QuizTake } from './QuizTake';

export const ModuleView = ({ module, studentId, onBack }) => {
  const { getQuizzesByModule, updateModuleProgress, getStudentProgress } = useApp();
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(null);
  const moduleQuizzes = getQuizzesByModule(module.id);
  const studentProgress = getStudentProgress(studentId);
  const currentProgress =
    studentProgress.moduleProgress[module.id] || { percentComplete: 0, status: 'not-started' };

  const handleMarkComplete = () => {
    if (progress < 100) {
      setProgress(100);
    }
    updateModuleProgress(studentId, module.id, 100, 'completed');
    alert('Module marked as completed!');
  };

  const handleUpdateProgress = (newProgress) => {
    setProgress(newProgress);
    updateModuleProgress(studentId, module.id, newProgress, 'in-progress');
  };

  return (
    <div className="module-view-container">
      <button className="btn-back" onClick={onBack}>
        ← Back to Modules
      </button>

      <div className="module-view-header">
        <div>
          <h1>{module.title}</h1>
          <p>{module.description}</p>
        </div>
        <div className="progress-indicator">
          <div className="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="progress-background" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="progress-fill"
                style={{
                  strokeDasharray: `${(currentProgress.percentComplete / 100) * 282.7} 282.7`,
                }}
              />
            </svg>
            <div className="progress-text">{currentProgress.percentComplete}%</div>
          </div>
          <p className="status-text">{currentProgress.status}</p>
        </div>
      </div>

      <div className="module-view-content">
        <div className="content-section">
          <h2>Module Content</h2>
          <div className="content-body">
            {module.content}
          </div>

          <div className="progress-controls">
            <label>Mark your progress:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress || currentProgress.percentComplete}
              onChange={(e) => handleUpdateProgress(parseInt(e.target.value))}
              className="progress-slider"
            />
            <span className="progress-value">
              {progress || currentProgress.percentComplete}%
            </span>
            <button
              className="btn-primary"
              onClick={handleMarkComplete}
              disabled={currentProgress.percentComplete === 100}
            >
              {currentProgress.percentComplete === 100
                ? '✓ Completed'
                : 'Mark as Complete'}
            </button>
          </div>
        </div>

        <div className="quizzes-section">
          <h2>Module Quizzes ({moduleQuizzes.length})</h2>
          {moduleQuizzes.length === 0 ? (
            <div className="no-quizzes">
              <p>No quizzes available for this module yet</p>
            </div>
          ) : (
            <div className="quiz-list">
              {moduleQuizzes.map((quiz) => {
                const quizScore = studentProgress?.quizScores?.[quiz.id];
                return (
                  <div key={quiz.id} className="quiz-card">
                    <div className="quiz-info">
                      <h3>{quiz.title}</h3>
                      <p>{quiz.questions.length} questions</p>
                      {quizScore && (
                        <div className="quiz-score">
                          Score: <strong>{quizScore.score}%</strong>
                        </div>
                      )}
                    </div>
                    <button
                      className={`btn-take-quiz ${quizScore ? 'retake' : ''}`}
                      onClick={() => setShowQuiz(quiz.id)}
                    >
                      {quizScore ? 'Retake Quiz' : 'Take Quiz'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showQuiz && (
        <div className="modal-overlay" onClick={() => setShowQuiz(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowQuiz(null)}
            >
              ✕
            </button>
            <QuizTake
              quiz={moduleQuizzes.find((q) => q.id === showQuiz)}
              studentId={studentId}
              onClose={() => setShowQuiz(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
