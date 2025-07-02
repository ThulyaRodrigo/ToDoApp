import React from 'react';

export default function ConfirmDialog({ type, task, onConfirm, onCancel }) {
  const getDialogContent = () => {
    switch (type) {
      case 'delete':
        return {
          title: 'Delete Task',
          message: `Are you sure you want to delete "${task?.title}"?`,
          subMessage: 'This action cannot be undone.',
          confirmText: 'Delete Task',
          confirmColor: 'bg-red-600 hover:bg-red-700',
          icon: (
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ),
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'complete':
        const isCompleting = !task?.completed;
        return {
          title: isCompleting ? 'Complete Task' : 'Mark as Incomplete',
          message: isCompleting 
            ? `Mark "${task?.title}" as complete?`
            : `Mark "${task?.title}" as incomplete?`,
          subMessage: isCompleting 
            ? 'The task will be moved to the completed section.'
            : 'The task will be moved back to active tasks.',
          confirmText: isCompleting ? 'Complete Task' : 'Mark Incomplete',
          confirmColor: isCompleting 
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700',
          icon: isCompleting ? (
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
          bgColor: isCompleting ? 'bg-green-50' : 'bg-blue-50',
          borderColor: isCompleting ? 'border-green-200' : 'border-blue-200'
        };
      default:
        return {
          title: 'Confirm Action',
          message: 'Are you sure you want to proceed?',
          subMessage: '',
          confirmText: 'Confirm',
          confirmColor: 'bg-blue-600 hover:bg-blue-700',
          icon: (
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const content = getDialogContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* Modal */}
        <div className={`
          ${content.bgColor} 
          rounded-lg shadow-lg border ${content.borderColor}
          transform transition-all duration-200
          overflow-hidden
        `}>
          {/* Header with Icon */}
          <div className="text-center pt-6 pb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-sm mb-4">
              {content.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {content.title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="text-center mb-6">
              <p className="text-gray-800 font-medium mb-2">
                {content.message}
              </p>
              {content.subMessage && (
                <p className="text-sm text-gray-600">
                  {content.subMessage}
                </p>
              )}
            </div>

            {/* Task Preview */}
            {task && (
              <div className="bg-white rounded-lg p-3 mb-6 shadow-sm border">
                <div className="flex items-center space-x-3">
                  <div className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${task.priority === 'High' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'}
                  `}>
                    {task.priority}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-600 truncate">{task.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`
                  flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white 
                  ${content.confirmColor}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  transition-colors duration-200
                `}
              >
                {content.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
