import React, { useState } from 'react';
import RequirementCard from './RequirementCard';
import CreateRequirementModal from './CreateRequirementModal';
import RequirementDetailsModal from './RequirementDetailsModal';
import { useAuth } from '../context/AuthContext';

const RequirementsTab = ({ projectId, requirements = [], onRefresh, project }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const { user } = useAuth();

  const isOwner = user && project && project.owner && user.id === project.owner.id;

  const safeRequirements = Array.isArray(requirements) ? requirements : [];
  const openRequirements = safeRequirements.filter(r => r.status === 'OPEN');
  const closedRequirements = safeRequirements.filter(r => r.status === 'CLOSED');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Project Requirements</h3>
          <p className="text-sm text-gray-600 mt-1">
            {isOwner 
              ? 'Post requirements for different skill level developers' 
              : 'View and apply for project requirements'}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Post Requirement
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">{openRequirements.length}</div>
          <div className="text-sm text-green-600">Open Requirements</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{closedRequirements.length}</div>
          <div className="text-sm text-gray-600">Closed Requirements</div>
        </div>
      </div>

      {/* Requirements List */}
      {safeRequirements.length > 0 ? (
        <div className="space-y-6">
          {/* Open Requirements */}
          {openRequirements.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">🟢 Open Requirements</h4>
              <div className="space-y-3">
                {openRequirements.map((requirement) => (
                  <RequirementCard
                    key={requirement.id}
                    requirement={requirement}
                    onClick={() => setSelectedRequirement(requirement)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Closed Requirements */}
          {closedRequirements.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-3">🔒 Closed Requirements</h4>
              <div className="space-y-3">
                {closedRequirements.map((requirement) => (
                  <RequirementCard
                    key={requirement.id}
                    requirement={requirement}
                    onClick={() => setSelectedRequirement(requirement)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">No requirements posted yet</p>
          {isOwner && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Post First Requirement
            </button>
          )}
        </div>
      )}

      {/* Create Requirement Modal */}
      {showCreateModal && (
        <CreateRequirementModal
          projectId={projectId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            onRefresh();
          }}
        />
      )}

      {/* Requirement Details Modal */}
      {selectedRequirement && (
        <RequirementDetailsModal
          requirement={selectedRequirement}
          onClose={() => setSelectedRequirement(null)}
          onRefresh={onRefresh}
          isOwner={isOwner}
        />
      )}
    </div>
  );
};

export default RequirementsTab;