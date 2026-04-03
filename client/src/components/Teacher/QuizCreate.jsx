import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export const QuizCreate = ({ moduleId }) => {
  const { user } = useAuth();
  const { createQuiz } = useApp();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);

  const handleAddQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id)) + 1;
    setQuestions([
      ...questions,
      { id: newId, question: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleQuestionChange = (id, text) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, question: text } : q))
    );
  };

  const handleOptionChange = (id, index, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? text : opt)),
            }
          : q
      )
    );
  };

  const handleCorrectAnswerChange = (id, index) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, correctAnswer: index } : q))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      alert('Please enter a quiz title');
      return;
    }

    const allQuestionsValid = questions.every(
      (q) => q.question && q.options.every((opt) => opt)
    );

    if (!allQuestionsValid) {
      alert('Please fill in all questions and options');
      return;
    }

    createQuiz(title, moduleId, user.id, questions);
    alert('Quiz created successfully!');
    setTitle('');
    setQuestions([
      { id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  return (
    <form className="quiz-create-form" onSubmit={handleSubmit}>
      <h3>Create Quiz for Module</h3>

      <div className="form-group">
        <label>Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Module 1 Assessment"
        />
      </div>

      <div className="questions-section">
        <h4>Questions</h4>
        {questions.map((question, idx) => (
          <div key={question.id} className="question-block">
            <div className="question-header">
              <label>Question {idx + 1}</label>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="btn-danger-small"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  Remove
                </button>
              )}
            </div>

            <textarea
              value={question.question}
              onChange={(e) => handleQuestionChange(question.id, e.target.value)}
              placeholder="Enter question text"
              rows="2"
            ></textarea>

            <div className="options-section">
              {question.options.map((option, optIdx) => (
                <label key={optIdx} className="option-label">
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctAnswer === optIdx}
                    onChange={() =>
                      handleCorrectAnswerChange(question.id, optIdx)
                    }
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(question.id, optIdx, e.target.value)
                    }
                    placeholder={`Option ${optIdx + 1}`}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleAddQuestion}
        >
          + Add Question
        </button>
        <button type="submit" className="btn-primary">
          Create Quiz
        </button>
      </div>
    </form>
  );
};
