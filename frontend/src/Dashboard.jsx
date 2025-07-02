import React, { useCallback, useEffect, useState } from 'react';

import ConfirmDialog from './components/ConfirmDialog';
import SearchBar from './components/SearchBar';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import axios from 'axios';

const API = 'http://localhost:5001/api';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    filter: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ show: false, type: '', task: null });

  // Get authorization headers
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // Fetch tasks with current filters
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API}/tasks?${params}`, getAuthHeaders());
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch task statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/tasks/stats/overview`, getAuthHeaders());
      console.log('Stats response:', response.data); // Debug log
      console.log('Stats set to:', response.data); // Additional debug log
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      console.error('Stats fetch error details:', err.response?.data || err.message);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTasks();
    fetchStats();
    
    // Set up periodic stats refresh for real-time updates
    const statsInterval = setInterval(() => {
      fetchStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(statsInterval);
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(`${API}/tasks`, taskData, getAuthHeaders());
      setTasks(prev => [response.data, ...prev]);
      setShowTaskForm(false);
      fetchStats();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API}/tasks/${taskId}`, taskData, getAuthHeaders());
      setTasks(prev => prev.map(task => task._id === taskId ? response.data : task));
      setEditingTask(null);
      fetchStats();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  // Handle task completion toggle
  const handleToggleComplete = async (task) => {
    try {
      const endpoint = task.completed ? 'reset' : 'complete';
      const response = await axios.patch(`${API}/tasks/${task._id}/${endpoint}`, {}, getAuthHeaders());
      setTasks(prev => prev.map(t => t._id === task._id ? response.data : t));
      fetchStats();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}`, getAuthHeaders());
      setTasks(prev => prev.filter(task => task._id !== taskId));
      fetchStats();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Confirmation dialog handlers
  const showConfirmation = (type, task) => {
    setConfirmDialog({ show: true, type, task });
  };

  const handleConfirm = async () => {
    const { type, task } = confirmDialog;
    
    if (type === 'delete') {
      await handleDeleteTask(task._id);
    } else if (type === 'complete') {
      await handleToggleComplete(task);
    }
    
    setConfirmDialog({ show: false, type: '', task: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ show: false, type: '', task: null });
  };

  // Filter handlers
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Todo Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome back, {user.username}!</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Dashboard */}
        <TaskStats stats={stats} />

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Add Task */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <SearchBar onSearch={handleSearch} />
              </div>
              <button
                onClick={() => setShowTaskForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>

            {/* Filters */}
            <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Task Form Modal */}
        {(showTaskForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? 
              (data) => handleUpdateTask(editingTask._id, data) : 
              handleCreateTask
            }
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={(task) => showConfirmation('complete', task)}
          onEditTask={setEditingTask}
          onDeleteTask={(task) => showConfirmation('delete', task)}
        />

        {/* Confirmation Dialog */}
        {confirmDialog.show && (
          <ConfirmDialog
            type={confirmDialog.type}
            task={confirmDialog.task}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}
