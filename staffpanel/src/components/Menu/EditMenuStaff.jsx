import React, { useEffect, useState } from 'react';
import Nav from '../Nav';
import { useNavigate, useParams } from 'react-router-dom';

function EditMenu() {
  const [itemData, setItemData] = useState({
    title: '',
    price: '',
    type: '',
    menuType: '', // Added menuType field
    categories: []
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const {id} = useParams();

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value
    });
  };

  // Handle category selection
  const toggleCategory = (category) => {
    const categoryLower = category.toLowerCase();
    if (itemData.categories.includes(categoryLower)) {
      // Remove category if already selected
      setItemData({
        ...itemData,
        categories: itemData.categories.filter(cat => cat !== categoryLower)
      });
    } else {
      // Add category if not selected
      setItemData({
        ...itemData,
        categories: [...itemData.categories, categoryLower]
      });
    }
  };

  // Handle image upload with preview
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation check for required fields
    if (!itemData.title) {
      alert('Please enter a dish name');
      return;
    }
    
    if (!itemData.price) {
      alert('Please enter a price');
      return;
    }
    
    if (!itemData.type) {
      alert('Please select a food type');
      return;
    }
    
    if (!itemData.menuType) {
      alert('Please select a menu type');
      return;
    }
    
    if (itemData.categories.length === 0) {
      alert('Please select at least one category');
      return;
    }
    
    if (!image) {
      alert('Please upload an image');
      return;
    }
    
    // Prepare the data to be submitted
    const formData = {
      ...itemData,
      image
    };
    
    // Log the data to console
    console.log('Menu Item Data:', formData);
    
    // Show success message
    alert('Menu item updated successfully!');
    
    // Reset form (optional)
    setItemData({
      title: '',
      price: '',
      type: '',
      menuType: '',
      categories: []
    });
    setImage(null);
    setImagePreview(null);
  };

  const handleGetSingleMenu = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/staff/get-single-menu/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch menu details: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Validate the structure of the response data
      if (data && data.title && data.price && data.type && data.categories) {
        setItemData({
          title: data.title,
          price: data.price,
          type: data.type.toLowerCase(),
          menuType: data.menuType || '', // Set menuType from API or default to empty
          categories: data.categories.map((cat) => cat.toLowerCase()),
        });
      } else {
        console.error('Unexpected data structure from API:', data);
      }
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    }
  };
  
  // Categories to choose from with food menu names
  const availableCategories = [
    'Momo', 'Salads', 'Soups', 'Burgers', 'Pasta', 'Pizza', 
    'Seafood', 'Main Courses', 'Desserts', 'Sandwiches',
    'Vegan', 'Gluten-Free', 'Chowmein', 'Specials',
    "Cold-drinks", "Hot-drinks"
  ];

  // Types of items
  const itemTypes = ['Vegetarian', 'Non-vegetarian', 'Drinks', 'Breakfast'];
  
  // Menu types
  const menuTypes = ['normal', 'todays-special'];

  useEffect(() => {
    //get menu details
    handleGetSingleMenu();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Nav bar */}
      <div className="fixed left-0 top-0 h-full">
        <Nav />
      </div>
      
      {/* Main content with margin to accommodate fixed nav */}
      <div className="flex-1 ml-16 md:ml-64 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
            >
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Menu Item</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Dish Name*</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={itemData.title}
                    onChange={handleChange}
                    placeholder="Enter dish name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                
                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)*</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={itemData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                
                {/* Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Food Type*</label>
                  <select
                    id="type"
                    name="type"
                    value={itemData.type}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="" disabled>Select a type</option>
                    {itemTypes.map((type, index) => (
                      <option key={index} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Menu Type - newly added */}
                <div>
                  <label htmlFor="menuType" className="block text-sm font-medium text-gray-700 mb-1">Menu Type*</label>
                  <select
                    id="menuType"
                    name="menuType"
                    value={itemData.menuType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="" disabled>Select a type</option>
                    {menuTypes.map((menuType, index) => (
                      <option key={index} value={menuType}>
                        {menuType === 'normal' ? 'Normal' : 'Today\'s Special'}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Image*</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center justify-center px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-md cursor-pointer transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {imagePreview && (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-300">
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-gray-800 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right column */}
              <div>
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menu Categories*</label>
                  <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
                  
                  <div className="h-64 overflow-y-auto p-2 border border-gray-300 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      {availableCategories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={`category-${index}`}
                            type="checkbox"
                            className="h-4 w-4 text-gray-700 border-gray-300 rounded focus:ring-gray-500"
                            checked={itemData.categories.includes(category.toLowerCase())}
                            onChange={() => toggleCategory(category)}
                          />
                          <label htmlFor={`category-${index}`} className="ml-2 text-sm text-gray-700">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {itemData.categories.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Selected categories:</p>
                      <div className="flex flex-wrap gap-1">
                        {itemData.categories.map((category, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            {category}
                            <button
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-600 hover:text-gray-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-md font-medium transition"
              >
                UPDATE MENU
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditMenu;