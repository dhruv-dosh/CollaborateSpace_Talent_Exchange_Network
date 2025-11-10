import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    if (!user) {
      // User not logged in, redirect to login with return URL
      localStorage.setItem('invitationToken', token);
      navigate('/login?redirect=accept-invitation');
      return;
    }

    acceptInvitation(token);
  }, [user]);

  const acceptInvitation = async (token) => {
    try {
      console.log('Accepting invitation with token:', token);
      
      const response = await api.get(`/api/projects/accept_invitation?token=${token}`);
      
      console.log('Invitation accepted:', response.data);
      
      setSuccess(true);
      setProjectId(response.data.projectId);
      
      // Redirect to project after 2 seconds
      setTimeout(() => {
        if (response.data.projectId) {
          navigate(`/project/${response.data.projectId}`);
        } else {
          navigate('/');
        }
      }, 2000);
      
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(
        err.response?.data?.message || 
        'Failed to accept invitation. The link may be invalid or expired.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Invitation...
          </h2>
          <p className="text-gray-600">Please wait while we add you to the project</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invitation Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invitation Accepted!
            </h2>
            <p className="text-gray-600 mb-6">
              You have been successfully added to the project. Redirecting...
            </p>
            <div className="animate-pulse text-blue-600">
              Taking you to the project...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AcceptInvitationPage;