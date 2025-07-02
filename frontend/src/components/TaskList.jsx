import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, onToggleComplete, onEditTask, onDeleteTask }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-6">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600 mb-4">Create your first task to get organized!</p>
        <div className="text-sm text-gray-500">
          <span className="inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Click "Add Task" above to get started
          </span>
        </div>
      </div>
    );
  }

  // Group tasks by status for better organization
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const overdueTasks = activeTasks.filter(task => task.dueDate && new Date(task.dueDate) < new Date());
  const upcomingTasks = activeTasks.filter(task => !task.dueDate || new Date(task.dueDate) >= new Date());

  return (
    <div className="space-y-6">
      {/* Task Summary Header */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Your Tasks ({tasks.length})
            </h2>
            <div className="flex items-center space-x-6 text-sm">
              {overdueTasks.length > 0 && (
                <span className="text-red-600 font-medium">
                  🚨 {overdueTasks.length} Overdue
                </span>
              )}
              <span className="text-blue-600 font-medium">
                📋 {upcomingTasks.length} Active
              </span>
              <span className="text-green-600 font-medium">
                ✅ {completedTasks.length} Completed
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
        </div>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-red-200">
          <div className="p-4 border-b border-red-100 bg-red-50">
            <h3 className="text-lg font-semibold text-red-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Overdue Tasks ({overdueTasks.length})
            </h3>
            <p className="text-sm text-red-600 mt-1">These tasks need immediate attention</p>
          </div>
          <div className="divide-y divide-gray-100">
            {overdueTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={() => onToggleComplete(task)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Tasks */}
      {upcomingTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-blue-200">
          <div className="p-4 border-b border-blue-100 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Active Tasks ({upcomingTasks.length})
            </h3>
            <p className="text-sm text-blue-600 mt-1">Tasks in progress</p>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={() => onToggleComplete(task)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-green-200">
          <div className="p-4 border-b border-green-100 bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed Tasks ({completedTasks.length})
            </h3>
            <p className="text-sm text-green-600 mt-1">Well done!</p>
          </div>
          <div className="divide-y divide-gray-100">
            {completedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onToggleComplete={() => onToggleComplete(task)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
