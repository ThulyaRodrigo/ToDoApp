import React from 'react';

export default function TaskStats({ stats }) {
  const getCompletionRate = () => {
    return stats.completionRate || 0;
  };

  const getOnTimeRate = () => {
    return stats.onTimeRate || 0;
  };

  const mainStats = [
    {
      title: 'Total Tasks',
      value: stats.total || 0,
      color: 'slate',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      subtitle: 'All tasks'
    },
    {
      title: 'Active',
      value: stats.active || 0,
      color: 'blue',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      subtitle: 'In progress'
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      color: 'green',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subtitle: `${getCompletionRate()}% rate`
    },
    {
      title: 'Overdue',
      value: stats.overdue || 0,
      color: 'red',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      subtitle: 'Need attention'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      slate: {
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        icon: 'bg-slate-600 text-white',
        text: 'text-slate-900',
        subtitle: 'text-slate-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'bg-blue-600 text-white',
        text: 'text-blue-900',
        subtitle: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'bg-green-600 text-white',
        text: 'text-green-900',
        subtitle: 'text-green-600'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'bg-red-600 text-white',
        text: 'text-red-900',
        subtitle: 'text-red-600'
      }
    };
    return colors[color] || colors.slate;
  };


  return (
    <div className="mb-8">
      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-6 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${colors.icon} p-2 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${colors.text}`}>{stat.value}</p>
                </div>
              </div>
              <p className={`text-sm ${colors.subtitle}`}>{stat.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Insights - Only show if there are completed tasks */}
      {stats.completed > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-600 p-2 rounded-lg text-white mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-green-800">On-Time Completion</span>
              </div>
              <span className="text-lg font-bold text-green-900">{getOnTimeRate()}%</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-600 p-2 rounded-lg text-white mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-orange-800">Overdue Completed</span>
              </div>
              <span className="text-lg font-bold text-orange-900">{stats.completedOverdue || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
