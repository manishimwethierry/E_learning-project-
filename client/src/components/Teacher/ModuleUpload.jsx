import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

export const ModuleUpload = ({ teacherId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [assignTo, setAssignTo] = useState([]);
  const { uploadModule, assignModuleToStudents, students } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !content) {
      alert('Please fill in all fields');
      return;
    }

    const module = uploadModule(title, description, content, teacherId);
    if (assignTo.length > 0) {
      assignModuleToStudents(module.id, assignTo);
    }

    setTitle('');
    setDescription('');
    setContent('');
    setAssignTo([]);
    onSuccess();
  };

  const handleStudentSelect = (studentId) => {
    setAssignTo((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <form className="module-upload-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Module Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., JavaScript Basics"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the module"
          rows="3"
        ></textarea>
      </div>

      <div className="form-group">
        <label>Module Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Module content or notes"
          rows="6"
        ></textarea>
      </div>

      <div className="form-group">
        <label>Assign to Students</label>
        <div className="student-list">
          {students.map((student) => (
            <label key={student.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={assignTo.includes(student.id)}
                onChange={() => handleStudentSelect(student.id)}
              />
              {student.name}
            </label>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Upload Module
        </button>
      </div>
    </form>
  );
};
