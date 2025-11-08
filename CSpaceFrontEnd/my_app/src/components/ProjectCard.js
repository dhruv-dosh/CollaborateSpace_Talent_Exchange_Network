import React from 'react';

const ProjectCard = ({ project, onClick, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div 
        onClick={onClick}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>Category: {project.category}</span>
          <span>{project.team?.length || 0} members</span>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-2 text-sm pt-3 border-t border-gray-200">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {project.owner?.fullName?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-600">by {project.owner?.fullName}</span>
        </div>
      </div>

      {/* Action Buttons - Only show if showActions is true */}
      {showActions && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;