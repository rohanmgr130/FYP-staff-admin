import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Categoryadd() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = 'http://localhost:4000/api/category';

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        e.target.value = null;
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        e.target.value = null;
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', description: '', image: null });
    setImagePreview(null);
    setEditMode(false);
    setCurrentCategoryId(null);
  };

  // Submit form with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Additional validations
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    // For new categories, image is required
    if (!editMode && !formData.image) {
      toast.error('Please select an image for the category');
      return;
    }

    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('description', formData.description.trim());
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      let res;
      if (editMode) {
        res = await axios.put(`${API_BASE_URL}/${currentCategoryId}`, data);
      } else {
        res = await axios.post(API_BASE_URL, data);
      }
      
      toast.success(res.data.message || `Category ${editMode ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || `Failed to ${editMode ? 'update' : 'add'} category`;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories with error handling and retry
  const fetchCategories = useCallback(async (retry = true) => {
    setFetchLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/get-all-category`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories");
      
      // Auto retry once after 2 seconds in case of network error
      if (retry) {
        setTimeout(() => fetchCategories(false), 2000);
      }
    } finally {
      setFetchLoading(false);
    }
  }, [API_BASE_URL]);

  // Edit category
  const editCategory = (category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: null // We don't set the actual file here
    });
    setImagePreview(`http://localhost:4000${category.image}`);
    setEditMode(true);
    setCurrentCategoryId(category._id);
    
    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Delete category with confirmation
  const deleteCategory = async (id, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const CategoryCard = ({ category }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="relative h-48">
        <img
          src={`http://localhost:4000${category.image}`}
          alt={category.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{category.name}</h3>
        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">
          {category.description || 'No description provided'}
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => editCategory(category)}
            className="px-3 py-1 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => deleteCategory(category._id, category.name)}
            className="px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ml-64 p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Category Management</h1>
        
        {/* Form Section */}
        <div className="mb-8 bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            {editMode ? 'Edit Category' : 'Add New Category'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Image {!editMode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
                required={!editMode} // Only required for new categories
              />
              <p className="mt-1 text-sm text-gray-500">Max size: 5MB. Recommended size: 600x400px</p>
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-40 object-cover rounded border border-gray-300" 
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded transition-colors flex justify-center items-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{editMode ? 'Update Category' : 'Create Category'}</>
                )}
              </button>
              
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Categories List Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <h2 className="text-2xl font-bold text-gray-700">All Categories</h2>
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-8 border border-gray-300 rounded w-full md:w-64"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {fetchLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No categories match your search.' : 'No categories found. Create your first category above.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map(cat => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          )}
          
          {/* Categories stats */}
          {categories.length > 0 && (
            <div className="mt-6 text-sm text-gray-600 flex justify-between items-center">
              <span>
                {searchQuery ? `${filteredCategories.length} of ${categories.length} categories displayed` : `${categories.length} categories total`}
              </span>
              
              {/* Refresh button */}
              <button 
                onClick={() => fetchCategories()}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                disabled={fetchLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categoryadd;