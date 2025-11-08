import React, { useState } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const OverviewTab = ({ project, onRefresh }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  // Check if current user is the owner
  const isOwner = user && project.owner && user.id === project.owner.id;

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/projects/invite', {
        email: inviteEmail,
        projectId: project.id
      });
      setMessage('Invitation sent successfully!');
      setInviteEmail('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Owner Info */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Project Owner</h3>
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {project.owner?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{project.owner?.fullName}</div>
            <div className="text-sm text-gray-500">{project.owner?.email}</div>
          </div>
          <span className="ml-auto px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
            Owner
          </span>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Team Members ({project.team?.length || 0})
        </h3>
        <div className="space-y-2">
          {project.team && project.team.length > 0 ? (
            project.team.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No team members yet</p>
          )}
        </div>
      </div>

      {/* Invite Section - Only visible to owner */}
      {isOwner ? (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3">Invite Team Member</h3>
          <p className="text-sm text-gray-600 mb-4">
            As the project owner, you can invite new members to collaborate.
          </p>
          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleInvite} className="flex gap-4">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </form>
        </div>
      ) : (
        <div className="border-t pt-6">
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded">
            <p className="text-sm">
              <strong>Note:</strong> Only the project owner can invite new members.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;