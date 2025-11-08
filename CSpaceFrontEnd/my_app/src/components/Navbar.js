import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center text-xl font-bold text-blue-600">
              CollabHub
            </Link>
            <Link to="/" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
              All Projects
            </Link>
            <Link to="/my-projects" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
              My Projects
            </Link>
            <Link to="/browse-requirements" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
              Browse Requirements
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.fullName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;