import React from 'react';

const RequirementCard = ({ requirement, onClick }) => {
  const getSkillLevelColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-purple-100 text-purple-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelLabel = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'Expert';
      case 'MEDIUM':
        return 'Intermediate';
      case 'LOW':
        return 'Beginner';
      default:
        return priority;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    return status === 'OPEN' ? 'Open' : 'Closed';
  };

  return (
    <div
      onClick={onClick}
      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 flex-1">{requirement.title}</h4>
        <span className={`px-3 py-1 text-xs rounded-full font-medium ml-2 ${getSkillLevelColor(requirement.priority)}`}>
          {getSkillLevelLabel(requirement.priority)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{requirement.description}</p>
      
      {requirement.tags && requirement.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {requirement.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={`px-2 py-1 rounded font-medium ${getStatusColor(requirement.status)}`}>
          {getStatusLabel(requirement.status)}
        </span>
        
        {requirement.dueDate && (
          <span>Due: {new Date(requirement.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      
      {requirement.assignee && (
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-sm">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {requirement.assignee.fullName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-600">Assigned to: {requirement.assignee.fullName}</span>
        </div>
      )}
    </div>
  );
};

export default RequirementCard;