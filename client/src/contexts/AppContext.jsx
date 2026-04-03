import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

// Mock database
const mockModules = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Learn JavaScript fundamentals',
    teacherId: 'teacher1',
    createdAt: '2024-01-15',
    content: 'var, let, const, functions, scope...',
    assignedTo: ['student1', 'student2'],
  },
  {
    id: 2,
    title: 'React Introduction',
    description: 'Introduction to React framework',
    teacherId: 'teacher1',
    createdAt: '2024-01-20',
    content: 'Components, JSX, Props, State...',
    assignedTo: ['student1'],
  },
];

const mockQuizzes = [
  {
    id: 1,
    title: 'JS Basics Quiz',
    moduleId: 1,
    teacherId: 'teacher1',
    questions: [
      {
        id: 1,
        question: 'What is a variable?',
        options: ['Storage location', 'Data type', 'Function', 'Object'],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: 'Which is correct?',
        options: ['var x = 5;', 'v x = 5;', '5 = x;', 'x := 5;'],
        correctAnswer: 0,
      },
    ],
  },
];

const mockStudentProgress = {
  student1: {
    moduleProgress: {
      1: { status: 'completed', percentComplete: 100 },
      2: { status: 'in-progress', percentComplete: 50 },
    },
    quizScores: {
      1: { score: 85, totalQuestions: 2, completedAt: '2024-01-16' },
    },
  },
  student2: {
    moduleProgress: {
      1: { status: 'in-progress', percentComplete: 30 },
    },
    quizScores: {},
  },
};

export const AppProvider = ({ children }) => {
  const [modules, setModules] = useState(mockModules);
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [studentProgress, setStudentProgress] = useState(mockStudentProgress);
  const [students, setStudents] = useState([
    { id: 'student1', name: 'john@example.com', email: 'john@example.com' },
    { id: 'student2', name: 'jane@example.com', email: 'jane@example.com' },
  ]);

  // Module actions
  const uploadModule = (title, description, content, teacherId) => {
    const newModule = {
      id: modules.length + 1,
      title,
      description,
      content,
      teacherId,
      createdAt: new Date().toISOString().split('T')[0],
      assignedTo: [],
    };
    setModules([...modules, newModule]);
    return newModule;
  };

  const assignModuleToStudents = (moduleId, studentIds) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId ? { ...module, assignedTo: studentIds } : module
      )
    );
  };

  const getTeacherModules = (teacherId) => {
    return modules.filter((m) => m.teacherId === teacherId);
  };

  const getStudentModules = (studentId) => {
    return modules.filter((m) => m.assignedTo.includes(studentId));
  };

  // Quiz actions
  const createQuiz = (title, moduleId, teacherId, questions) => {
    const newQuiz = {
      id: quizzes.length + 1,
      title,
      moduleId,
      teacherId,
      questions,
    };
    setQuizzes([...quizzes, newQuiz]);
    return newQuiz;
  };

  const submitQuizAnswers = (studentId, quizId, answers) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.correctAnswer === answers[idx]) {
        score++;
      }
    });

    const scorePercentage = Math.round((score / quiz.questions.length) * 100);

    setStudentProgress((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        quizScores: {
          ...prev[studentId].quizScores,
          [quizId]: {
            score: scorePercentage,
            totalQuestions: quiz.questions.length,
            completedAt: new Date().toISOString().split('T')[0],
          },
        },
      },
    }));

    return { score, totalQuestions: quiz.questions.length, scorePercentage };
  };

  const getQuizzesByModule = (moduleId) => {
    return quizzes.filter((q) => q.moduleId === moduleId);
  };

  // Progress tracking
  const updateModuleProgress = (studentId, moduleId, percentComplete, status = 'in-progress') => {
    setStudentProgress((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        moduleProgress: {
          ...prev[studentId].moduleProgress,
          [moduleId]: {
            percentComplete,
            status: percentComplete === 100 ? 'completed' : status,
          },
        },
      },
    }));
  };

  const getStudentProgress = (studentId) => {
    return studentProgress[studentId] || { moduleProgress: {}, quizScores: {} };
  };

  const getStudentsForModule = (moduleId, teacherId) => {
    const module = modules.find((m) => m.id === moduleId && m.teacherId === teacherId);
    if (!module) return [];
    return students.filter((s) => module.assignedTo.includes(s.id));
  };

  return (
    <AppContext.Provider
      value={{
        modules,
        quizzes,
        studentProgress,
        students,
        uploadModule,
        assignModuleToStudents,
        getTeacherModules,
        getStudentModules,
        createQuiz,
        submitQuizAnswers,
        getQuizzesByModule,
        updateModuleProgress,
        getStudentProgress,
        getStudentsForModule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
