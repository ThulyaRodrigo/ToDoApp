import React from 'react';

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High': 
        return {
          badge: 'bg-red-600 text-white',
          border: 'border-l-red-500',
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: '!'
        };
      case 'Medium': 
        return {
          badge: 'bg-yellow-600 text-white',
          border: 'border-l-yellow-500',
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          icon: '!'
        };
      case 'Low': 
        return {
          badge: 'bg-gray-600 text-white',
          border: 'border-l-gray-400',
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: '!'
        };
      default: 
        return {
          badge: 'bg-gray-600 text-white',
          border: 'border-l-gray-400',
          bg: 'bg-gray-50',
          icon: '🔵'
        };
    }
  };

  const getTaskStatus = () => {
    if (task.completed) {
      const wasOverdue = task.dueDate && new Date(task.completedAt) > new Date(task.dueDate);
      return {
        type: wasOverdue ? 'completed-overdue' : 'completed',
        config: wasOverdue ? {
          badge: 'bg-orange-600 text-white',
          border: 'border-l-orange-500',
          bg: 'bg-orange-50',
          text: 'text-orange-800',
          icon: '⚠',
          label: 'Completed Late'
        } : {
          badge: 'bg-green-600 text-white',
          border: 'border-l-green-500',
          bg: 'bg-green-50',
          text: 'text-green-800',
          icon: '✓',
          label: 'Completed'
        }
      };
    } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
      return {
        type: 'overdue',
        config: {
          badge: 'bg-red-600 text-white',
          border: 'border-l-red-600',
          bg: 'bg-red-50',
          text: 'text-red-800',
          icon: '!',
          label: 'Overdue'
        }
      };
    } else {
      return {
        type: 'active',
        config: {
          badge: 'bg-blue-600 text-white',
          border: 'border-l-blue-500',
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          icon: '●',
          label: 'Active'
        }
      };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusInfo = getTaskStatus();
  const isCompleted = task.completed;
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className={`
      bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 
      border-l-4 ${statusInfo.config.border} 
      ${isCompleted ? 'opacity-90' : 'hover:scale-102'}
      mb-4 overflow-hidden
    `}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Custom Checkbox */}
          <div className="flex-shrink-0 mt-1">
            <button
              onClick={() => onToggleComplete(task)}
              className={`
                relative w-6 h-6 rounded-full border-2 transition-all duration-200
                ${isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500' 
                  : isOverdue 
                    ? 'border-red-400 hover:border-red-500 hover:bg-red-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              `}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted && (
                <svg className="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Task Content */}
          <div className="flex-grow">
            {/* Status and Priority Badges */}
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.config.badge}`}>
                {statusInfo.config.icon} {statusInfo.config.label}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityConfig.badge}`}>
                {priorityConfig.icon} {task.priority}
              </span>
            </div>

            {/* Task Title */}
            <h3 className={`
              text-lg font-bold mb-2 transition-all duration-200
              ${isCompleted 
                ? 'text-gray-500 line-through decoration-2 decoration-gray-400' 
                : isOverdue 
                  ? 'text-red-800' 
                  : 'text-gray-900'
              }
            `}>
              {task.title}
            </h3>

            {/* Task Description */}
            {task.description && (
              <p className={`
                mb-4 text-sm leading-relaxed
                ${isCompleted 
                  ? 'text-gray-400 line-through decoration-1' 
                  : isOverdue 
                    ? 'text-red-700' 
                    : 'text-gray-600'
                }
              `}>
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-xs">
              {/* Due Date */}
              {task.dueDate && (
                <div className={`
                  flex items-center px-3 py-1 rounded-lg font-medium
                  ${isOverdue && !isCompleted
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : isCompleted
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }
                `}>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due: {formatDate(task.dueDate)}
                  {isOverdue && !isCompleted && (
                    <span className="ml-1 text-red-600 animate-pulse">⚠️</span>
                  )}
                </div>
              )}

              {/* Completion Date */}
              {task.completed && task.completedAt && (
                <div className={`
                  flex items-center px-3 py-1 rounded-lg font-medium
                  ${statusInfo.type === 'completed-overdue' 
                    ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                    : 'bg-green-100 text-green-800 border border-green-200'
                  }
                `}>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Completed: {formatDateTime(task.completedAt)}
                  {statusInfo.type === 'completed-overdue' && (
                    <span className="ml-1 text-orange-600">⚠️</span>
                  )}
                </div>
              )}

              {/* Created Date */}
              <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-lg">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Created: {formatDateTime(task.createdAt)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => onEdit(task)}
              className={`
                p-2 rounded-xl transition-all duration-200 transform hover:scale-110
                ${isCompleted 
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                  : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              `}
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={() => onDelete(task)}
              className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
