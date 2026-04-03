import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';

export const QuizTake = ({ quiz, studentId, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(quiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const { submitQuizAnswers } = useApp();

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      alert('Please answer all questions before submitting');
      return;
    }
    const quizResult = submitQuizAnswers(studentId, quiz.id, answers);
    setResult(quizResult);
    setSubmitted(true);
  };

  const question = quiz.questions[currentQuestion];

  if (submitted && result) {
    return (
      <div className="quiz-result">
        <h2>Quiz Submitted! 📝</h2>
        <div className="result-box">
          <div className="result-score">
            <div className="score-number">{result.scorePercentage}%</div>
            <p className="score-label">Your Score</p>
          </div>
          <div className="result-details">
            <p>
              You answered <strong>{result.score} out of {result.totalQuestions}</strong> questions
              correctly.
            </p>
            {result.scorePercentage >= 70 ? (
              <div className="result-message success">
                <strong>🎉 Great Job!</strong> Keep up the excellent work!
              </div>
            ) : (
              <div className="result-message warning">
                <strong>Keep Learning!</strong> Review the material and try again.
              </div>
            )}
          </div>
        </div>
        <button className="btn-primary" onClick={onClose}>
          Back to Module
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-fill"
          style={{
            width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="question-container">
        <h3 className="question-text">{question.question}</h3>

        <div className="options-list">
          {question.options.map((option, idx) => (
            <label key={idx} className="option-item">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === idx}
                onChange={() => handleAnswerSelect(idx)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          className="btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>

        <div className="question-indicators">
          {quiz.questions.map((_, idx) => (
            <button
              key={idx}
              className={`indicator ${
                idx === currentQuestion
                  ? 'active'
                  : answers[idx] !== null
                  ? 'answered'
                  : ''
              }`}
              onClick={() => setCurrentQuestion(idx)}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button className="btn-primary" onClick={handleSubmit}>
            Submit Quiz
          </button>
        ) : (
          <button className="btn-secondary" onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};
