import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import RequirementDetailsModal from '../components/RequirementDetailsModal';

const BrowseRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [filters, setFilters] = useState({
    status: 'OPEN',
    skillLevel: 'ALL',
    searchTerm: '',
    selectedTags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRequirements();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [requirements, filters]);

  const fetchAllRequirements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/requirements');
      const data = Array.isArray(res.data) ? res.data : [];
      setRequirements(data);
      
      const tags = new Set();
      data.forEach(req => {
        if (req.tags && Array.isArray(req.tags)) {
          req.tags.forEach(tag => tags.add(tag));
        }
      });
      setAvailableTags(Array.from(tags).sort());
    } catch (err) {
      console.error('Error fetching requirements:', err);
      setRequirements([]);
      setAvailableTags([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...requirements];

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(req => req.status === filters.status);
    }

    if (filters.skillLevel !== 'ALL') {
      filtered = filtered.filter(req => req.priority === filters.skillLevel);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.title.toLowerCase().includes(searchLower) ||
        req.description.toLowerCase().includes(searchLower) ||
        (req.project?.name && req.project.name.toLowerCase().includes(searchLower))
      );
    }

    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter(req =>
        req.tags && filters.selectedTags.some(tag => req.tags.includes(tag))
      );
    }

    setFilteredRequirements(filtered);
  };

  const toggleTag = (tag) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'OPEN',
      skillLevel: 'ALL',
      searchTerm: '',
      selectedTags: []
    });
  };

  const getSkillLevelColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-purple-100 text-purple-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelLabel = (priority) => {
    switch (priority) {
      case 'HIGH': return 'Expert';
      case 'MEDIUM': return 'Intermediate';
      case 'LOW': return 'Beginner';
      default: return priority;
    }
  };

  const getStatusColor = (status) => {
    return status === 'OPEN' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Requirements</h1>
          <p className="text-gray-600">Find and apply to project requirements across all projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  placeholder="Search requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Skill Level Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level
                </label>
                <select
                  value={filters.skillLevel}
                  onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Levels</option>
                  <option value="LOW">Beginner</option>
                  <option value="MEDIUM">Intermediate</option>
                  <option value="HIGH">Expert</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tech Stack / Tags
                </label>
                {availableTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          filters.selectedTags.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tags available</p>
                )}
              </div>
            </div>
          </div>

          {/* Requirements List */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredRequirements.length}</span> of{' '}
                <span className="font-semibold">{requirements.length}</span> requirements
              </p>
            </div>

            {filteredRequirements.length > 0 ? (
              <div className="space-y-4">
                {filteredRequirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    onClick={() => setSelectedRequirement(requirement)}
                    className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md cursor-pointer transition border border-gray-200 hover:border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {requirement.title}
                        </h3>
                        {requirement.project && (
                          <p className="text-sm text-gray-500">
                            Project: <span className="font-medium text-blue-600">{requirement.project.name}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${getSkillLevelColor(requirement.priority)}`}>
                          {getSkillLevelLabel(requirement.priority)}
                        </span>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${getStatusColor(requirement.status)}`}>
                          {requirement.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {requirement.description}
                    </p>

                    {requirement.tags && requirement.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {requirement.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {requirement.dueDate && (
                        <span>Due: {new Date(requirement.dueDate).toLocaleDateString()}</span>
                      )}
                      {requirement.project?.owner && (
                        <span>Posted by: {requirement.project.owner.fullName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">No requirements found</p>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requirement Details Modal */}
      {selectedRequirement && (
        <RequirementDetailsModal
          requirement={selectedRequirement}
          onClose={() => setSelectedRequirement(null)}
          onRefresh={fetchAllRequirements}
          isOwner={false}
        />
      )}
    </div>
  );
};

export default BrowseRequirements;