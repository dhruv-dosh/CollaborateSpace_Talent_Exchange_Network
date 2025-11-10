import React, { useState, useEffect } from 'react';
import api from '../config/api';

const EditProjectModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (project && initialLoad) {
      console.log('=== LOADING PROJECT FOR EDIT ===');
      console.log('Full project object:', JSON.stringify(project, null, 2));
      console.log('Project category:', project.category);
      console.log('Project category type:', typeof project.category);
      
      const loadedData = {
        name: project.name || '',
        description: project.description || '',
        category: project.category || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '')
      };
      
      console.log('Setting form data to:', loadedData);
      setFormData(loadedData);
      setInitialLoad(false);
    }
  }, [project, initialLoad]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate category is selected
    if (!formData.category || formData.category === '') {
      setError('Please select a category');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Split tags and filter empty ones
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const projectData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: tagsArray
      };
      
      console.log('=== SUBMITTING UPDATE ===');
      console.log('Project ID:', project.id);
      console.log('Update payload:', JSON.stringify(projectData, null, 2));
      
      const response = await api.put(`/api/projects/${project.id}`, projectData);
      
      console.log('=== UPDATE SUCCESSFUL ===');
      console.log('Response:', response.data);
      
      onSuccess();
    } catch (err) {
      console.error('=== UPDATE ERROR ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`Field "${field}" changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Debug info */}
        <div className="mb-4 p-3 bg-gray-100 rounded text-xs space-y-1">
          <div><strong>Debug Info:</strong></div>
          <div>Current Category: <span className="font-mono bg-yellow-200 px-1">"{formData.category}"</span></div>
          <div>Original Category: <span className="font-mono bg-blue-200 px-1">"{project?.category}"</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category * 
              <span className="ml-2 text-xs text-gray-500">
                (Current: {formData.category || 'none'})
              </span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('SELECT onChange triggered, new value:', newValue);
                handleInputChange('category', newValue);
              }}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="">-- Select a category --</option>
              <option value="fullstack">Fullstack</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="mobile">Mobile App</option>
              <option value="devops">DevOps</option>
              <option value="data-science">Data Science</option>
              <option value="machine-learning">Machine Learning</option>
              <option value="web-development">Web Development</option>
              <option value="desktop">Desktop Application</option>
              <option value="game-development">Game Development</option>
              <option value="other">Other</option>
            </select>
            
            {/* Visual indicator of selected value */}
            {formData.category && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Selected: <strong>{formData.category}</strong>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags <span className="text-gray-500">(comma separated, optional)</span>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;