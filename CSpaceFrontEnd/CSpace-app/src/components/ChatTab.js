import React, { useState, useEffect, useRef } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const ChatTab = ({ projectId, messages, user, onRefresh, project }) => {
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if current user is the owner
  const isOwner = user && project && project.owner && user.id === project.owner.id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await api.post('/api/messages/send', {
        senderId: user.id,
        projectId: projectId,
        content: newMessage
      });
      setNewMessage('');
      onRefresh();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllMessages = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/messages/chat/${projectId}`);
      setShowDeleteConfirm(false);
      onRefresh();
      alert('Chat history deleted successfully');
    } catch (err) {
      console.error('Error deleting messages:', err);
      alert(err.response?.data?.message || 'Failed to delete chat history');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-96">
      {/* Header with Delete Button (Only for Owner) */}
      {isOwner && messages.length > 0 && (
        <div className="mb-3 flex justify-between items-center pb-3 border-b">
          <span className="text-sm text-gray-600">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Clear Chat History
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-gray-50 rounded">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender?.id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender?.id === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {msg.sender?.id !== user.id && (
                <div className="text-xs font-semibold mb-1 opacity-75">
                  {msg.sender?.fullName}
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
              <div className={`text-xs mt-1 ${msg.sender?.id === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No messages yet. Start the conversation!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Chat History?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all messages in this chat? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllMessages}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTab;