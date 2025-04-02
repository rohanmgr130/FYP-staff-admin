import React, { useState, useRef } from 'react';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';

function CreateItem() {
  const [itemData, setItemData] = useState({
    title: '',
    price: '',
    type: '',
    menuType: '', // Changed to empty string as default
    categories: [],
    image: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create file reader to generate preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Set the file to state
      setItemData({
        ...itemData,
        image: file
      });
    }
  };

  // Clear image selection
  const clearImage = () => {
    setImagePreview(null);
    setItemData({
      ...itemData,
      image: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle category selection
  const toggleCategory = (category) => {
    const categoryLower = category.toLowerCase();
    if (itemData.categories.includes(categoryLower)) {
      setItemData({
        ...itemData,
        categories: itemData.categories.filter((cat) => cat !== categoryLower)
      });
    } else {
      setItemData({
        ...itemData,
        categories: [...itemData.categories, categoryLower]
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check for required fields
    if (!itemData.title || !itemData.price || !itemData.type || itemData.categories.length === 0 || !itemData.menuType || !itemData.image) {
      alert('All fields including image are required');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', itemData.title);
      formData.append('price', itemData.price);
      formData.append('type', itemData.type);
      formData.append('menuType', itemData.menuType);
      formData.append('image', itemData.image);
      
      // Append categories as array
      itemData.categories.forEach(category => {
        formData.append('categories[]', category);
      });

      const response = await fetch('http://localhost:4000/api/staff/add-menu-items', {
        method: 'POST',
        body: formData  // Changed to FormData instead of JSON.stringify
      });

      if (response.ok) {
        alert('Menu item added successfully!');
        navigate('/menu');
      } else {
        alert('Failed to add menu item');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('An error occurred while adding the menu item');
    }
  };

  // Categories to choose from
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full">
        <Nav />
      </div>

      <div className="flex-1 ml-16 md:ml-64 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="p-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
            >
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Menu Item</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Dish Name*</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={itemData.title}
                  onChange={handleChange}
                  placeholder="Enter dish name"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)*</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={itemData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Food Type*</label>
                <select
                  id="type"
                  name="type"
                  value={itemData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select a type</option>
                  {itemTypes.map((type, index) => (
                    <option key={index} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="menuType" className="block text-sm font-medium text-gray-700 mb-1">Menu Type*</label>
                <select
                  id="menuType"
                  name="menuType"
                  value={itemData.menuType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select a type</option>
                  {menuTypes.map((menuType, index) => (
                    <option key={index} value={menuType}>
                      {menuType === 'normal' ? 'Normal' : 'Today\'s Special'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Item Image*</label>
                <div className="flex flex-col space-y-2">
                  <input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Item preview" 
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Categories*</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        id={`category-${index}`}
                        type="checkbox"
                        name="categories"
                        className="h-4 w-4"
                        checked={itemData.categories.includes(category.toLowerCase())}
                        onChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={`category-${index}`} className="ml-2 text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-md"
              >
                ADD MENU ITEM
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateItem;