import React from 'react';

export const StudentModuleList = ({ modules, onSelectModule }) => {
  return (
    <div className="student-module-list">
      {modules.length === 0 ? (
        <div className="empty-state">
          <p>No modules assigned yet. Check back soon!</p>
        </div>
      ) : (
        modules.map((module) => (
          <div key={module.id} className="student-module-card">
            <div className="module-icon">📖</div>
            <div className="module-details">
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <span className="module-created">
                Created: {module.createdAt}
              </span>
            </div>
            <button
              className="btn-view-module"
              onClick={() => onSelectModule(module)}
            >
              View Module →
            </button>
          </div>
        ))
      )}
    </div>
  );
};
