import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/login`, form);
      localStorage.setItem('token', res.data.token);
      onAuth(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
   <div className="p-8 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Tailwind CSS Test
      </h1>
      
      <div className="space-y-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Primary Button
        </button>
        
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition">
          Secondary Button
        </button>
        
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>Warning alert box</p>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
        <div className="w-12 h-12 bg-red-400 rounded-full"></div>
        <div className="w-12 h-12 bg-green-400 rounded-full"></div>
        <div className="w-12 h-12 bg-purple-400 rounded-full"></div>
      </div>
    </div>
  );
}