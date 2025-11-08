import React, { useState, useEffect } from 'react';
import api from '../config/api';

const RequirementDetailsModal = ({ requirement, onClose, onRefresh, isOwner }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (requirement?.id) {
      fetchComments();
    }
  }, [requirement?.id]);

  const fetchComments = async () => {
    if (!requirement?.id) return;
    
    try {
      const res = await api.get(`/api/comments/${requirement.id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await api.post('/api/comments', {
        requirementId: requirement.id,
        content: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isOwner) {
      alert('Only project owner can change status');
      return;
    }

    try {
      await api.put(`/api/requirements/${requirement.id}/status/${newStatus}`);
      onRefresh();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!isOwner) {
      alert('Only project owner can delete requirements');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this requirement? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/api/requirements/${requirement.id}`);
      alert('Requirement deleted successfully');
      onRefresh();
      onClose();
    } catch (err) {
      console.error('Error deleting requirement:', err);
      alert('Failed to delete requirement: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
    }
  };

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

  if (!requirement) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{requirement.title}</h2>
          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition"
                title="Delete requirement"
              >
                {deleting ? (
                  <span className="text-sm">Deleting...</span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            )}
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600 mb-4 whitespace-pre-wrap">{requirement.description}</p>
          
          {requirement.tags && requirement.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {requirement.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 items-center mb-4">
            <div>
              <span className="text-sm text-gray-600">Skill Level: </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(requirement.priority)}`}>
                {getSkillLevelLabel(requirement.priority)}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-600">Status: </span>
              {isOwner ? (
                <select
                  value={requirement.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              ) : (
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(requirement.status)}`}>
                  {requirement.status === 'OPEN' ? 'Open' : 'Closed'}
                </span>
              )}
            </div>
          </div>

          {requirement.dueDate && (
            <div className="text-sm text-gray-600">
              Due Date: <span className="font-medium">{new Date(requirement.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 text-lg">
            Applications / Comments ({comments.length})
          </h3>
          
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-sm">{comment.user?.fullName}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(comment.createdDateTime).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No applications yet. Be the first to apply!</p>
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Apply or add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequirementDetailsModal;