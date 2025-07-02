import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    emailOrUsername: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post(`${API}/login`, {
          emailOrUsername: form.emailOrUsername,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        onAuth(res.data.user);
      } else {
        await axios.post(`${API}/signup`, {
          email: form.email,
          username: form.username,
          password: form.password,
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </>
        )}
        {isLogin && (
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            value={form.emailOrUsername}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
