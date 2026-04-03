import React from 'react';
import { useApp } from '../../contexts/AppContext';

export const StudentProgress = ({ teacherId }) => {
  const { getTeacherModules, getStudentsForModule, getStudentProgress } = useApp();
  const modules = getTeacherModules(teacherId);

  return (
    <div className="student-progress-container">
      {modules.length === 0 ? (
        <div className="empty-state">
          <p>No modules created yet</p>
        </div>
      ) : (
        modules.map((module) => {
          const assignedStudents = getStudentsForModule(module.id, teacherId);
          return (
            <div key={module.id} className="module-progress-section">
              <h3>{module.title}</h3>
              <div className="students-progress-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Progress %</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedStudents.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="no-data">
                          No students assigned to this module
                        </td>
                      </tr>
                    ) : (
                      assignedStudents.map((student) => {
                        const studentProgress = getStudentProgress(student.id);
                        const moduleProgress =
                          studentProgress.moduleProgress[module.id] || {
                            percentComplete: 0,
                            status: 'not-started',
                          };

                        return (
                          <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${moduleProgress.percentComplete}%`,
                                  }}
                                ></div>
                              </div>
                              {moduleProgress.percentComplete}%
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${moduleProgress.status}`}
                              >
                                {moduleProgress.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
