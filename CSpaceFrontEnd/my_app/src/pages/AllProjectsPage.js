import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Apply filters whenever search query, category, or tag changes
    applyFilters();
  }, [searchQuery, categoryFilter, tagFilter, projects]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/projects');
      console.log('Fetched projects:', response.data);
      setProjects(response.data);
      setFilteredProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];

    // Search by keyword (name, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.owner?.fullName?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(project => 
        project.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Filter by tag
    if (tagFilter.trim()) {
      const tag = tagFilter.toLowerCase();
      filtered = filtered.filter(project =>
        project.tags?.some(t => t.toLowerCase().includes(tag))
      );
    }

    console.log('Filtered projects:', filtered.length);
    setFilteredProjects(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setTagFilter('');
  };

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`);
  };

  // Get unique categories from projects
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Projects</h1>
        <p className="text-gray-600">Discover and collaborate on projects from the community</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Projects
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, description, or owner..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Tag
              </label>
              <input
                type="text"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="Enter tag to filter..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || categoryFilter || tagFilter) && (
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Search: "{searchQuery}"
                  </span>
                )}
                {categoryFilter && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Category: {categoryFilter}
                  </span>
                )}
                {tagFilter && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Tag: {tagFilter}
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              showActions={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || categoryFilter || tagFilter
              ? 'Try adjusting your filters or search query'
              : 'No projects available at the moment'}
          </p>
          {(searchQuery || categoryFilter || tagFilter) && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProjects;