import React from 'react';

export default function TaskFilters({ filters, onFilterChange }) {
  const filterOptions = [
    { key: 'filter', label: 'View', options: [
      { value: 'all', label: 'All Tasks' },
      { value: 'active', label: 'Active' },
      { value: 'completed', label: 'Completed' },
      { value: 'overdue', label: 'Overdue' },
      { value: 'today', label: 'Due Today' },
      { value: 'upcoming', label: 'Upcoming' }
    ]},
    { key: 'priority', label: 'Priority', options: [
      { value: 'all', label: 'All Priorities' },
      { value: 'High', label: 'High' },
      { value: 'Medium', label: 'Medium' },
      { value: 'Low', label: 'Low' }
    ]},
    { key: 'sortBy', label: 'Sort By', options: [
      { value: 'createdAt', label: 'Date Created' },
      { value: 'dueDate', label: 'Due Date' },
      { value: 'priority', label: 'Priority' },
      { value: 'title', label: 'Title' }
    ]}
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const toggleSortOrder = () => {
    const newOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange({ sortOrder: newOrder });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {filterOptions.map((filterGroup) => (
        <div key={filterGroup.key} className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-1">
            {filterGroup.label}
          </label>
          <select
            value={filters[filterGroup.key]}
            onChange={(e) => handleFilterChange(filterGroup.key, e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {filterGroup.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 mb-1">
          Order
        </label>
        <button
          onClick={toggleSortOrder}
          className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 flex items-center"
        >
          {filters.sortOrder === 'asc' ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Asc
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
              Desc
            </>
          )}
        </button>
      </div>
    </div>
  );
}
