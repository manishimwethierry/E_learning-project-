import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      login(email, password, role);
      navigate(role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-700 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8">
        <div className="text-center mb-6">
          <p className="text-sm text-indigo-700 font-semibold uppercase tracking-wider">E-Learning Management</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Login</h1>
          <p className="text-slate-500 mt-1">Sign in to access your dashboard</p>
        </div>
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg px-3 py-2">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600">Login as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-2 bg-white text-slate-800 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition ">
              Login
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};
