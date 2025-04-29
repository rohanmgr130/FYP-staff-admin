// import React, { useState, useRef } from 'react';
// import Nav from '../Nav';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

// function CreateItem() {
//   const [itemData, setItemData] = useState({
//     title: '',
//     price: '',
//     type: '',
//     menuType: '',
//     categories: [],
//     image: ''
//   });
  
//   const [errors, setErrors] = useState({});
//   const [imagePreview, setImagePreview] = useState(null);
//   const fileInputRef = useRef(null);

//   const navigate = useNavigate();

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setItemData({
//       ...itemData,
//       [name]: value
//     });
    
//     // Clear error for this field when user types
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Create file reader to generate preview
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImagePreview(reader.result);
//         // Show toast for successful image upload
//         toast.success('Image uploaded successfully');
//       };
//       reader.readAsDataURL(file);
      
//       // Set the file to state
//       setItemData({
//         ...itemData,
//         image: file
//       });
      
//       // Clear image error if it exists
//       if (errors.image) {
//         setErrors({
//           ...errors,
//           image: ''
//         });
//       }
//     }
//   };

//   // Clear image selection
//   const clearImage = () => {
//     setImagePreview(null);
//     setItemData({
//       ...itemData,
//       image: ''
//     });
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//     // Show toast for image removal
//     toast.success('Image removed');
//   };

//   // Handle category selection
//   const toggleCategory = (category) => {
//     const categoryLower = category.toLowerCase();
//     if (itemData.categories.includes(categoryLower)) {
//       setItemData({
//         ...itemData,
//         categories: itemData.categories.filter((cat) => cat !== categoryLower)
//       });
//       // Show toast for category removal
//       toast.success(`Removed ${category} category`);
//     } else {
//       setItemData({
//         ...itemData,
//         categories: [...itemData.categories, categoryLower]
//       });
//       // Show toast for category addition
//       toast.success(`Added ${category} category`);
      
//       // Clear categories error if it exists
//       if (errors.categories) {
//         setErrors({
//           ...errors,
//           categories: ''
//         });
//       }
//     }
//   };

//   // Validate form fields
//   const validateForm = () => {
//     const newErrors = {};
    
//     // Check title (trim to handle spaces)
//     if (!itemData.title.trim()) {
//       newErrors.title = 'Dish name is required';
//     }
    
//     // Check price
//     if (!itemData.price) {
//       newErrors.price = 'Price is required';
//     } else if (parseFloat(itemData.price) <= 0) {
//       newErrors.price = 'Price must be greater than zero';
//     }
    
//     // Check type
//     if (!itemData.type) {
//       newErrors.type = 'Food type is required';
//     }
    
//     // Check menuType
//     if (!itemData.menuType) {
//       newErrors.menuType = 'Menu type is required';
//     }
    
//     // Check categories
//     if (itemData.categories.length === 0) {
//       newErrors.categories = 'At least one category is required';
//     }
    
//     // Check image
//     if (!itemData.image) {
//       newErrors.image = 'Image is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // Validate form
//     if (!validateForm()) {
//       // Show toast for validation errors with specific missing fields
//       const errorFields = Object.keys(errors).map(field => {
//         // Format field names for better readability
//         const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
//         return formattedField;
//       }).join(', ');
      
//       toast.error(`Please complete required fields: ${errorFields}`);
      
//       // Scroll to the first error
//       const firstErrorField = document.querySelector('.error-message');
//       if (firstErrorField) {
//         firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//       return;
//     }
  
//     try {
//       // Create FormData for file upload
//       const formData = new FormData();
//       formData.append('title', itemData.title.trim()); // Trim spaces from title
//       formData.append('price', itemData.price);
//       formData.append('type', itemData.type);
//       formData.append('menuType', itemData.menuType);
//       formData.append('image', itemData.image);
      
//       // Append each category individually
//       itemData.categories.forEach(category => {
//         formData.append('categories', category);
//       });
  
//       // Show loading toast
//       const loadingToast = toast.loading('Adding menu item...');
      
//       // Display detailed toast message
//       toast(`Adding ${itemData.title} to the menu`, { icon: '🍽️' });
      
//       const response = await fetch('http://localhost:4000/api/staff/add-menu-items', {
//         method: 'POST',
//         body: formData
//       });
  
//       // Dismiss loading toast
//       toast.dismiss(loadingToast);
      
//       if (response.ok) {
//         // Success toast with dish name
//         toast.success(`${itemData.title} added successfully to the menu!`, {
//           icon: '✅',
//           duration: 4000
//         });
        
//         // Add a small delay before navigation for better UX
//         setTimeout(() => {
//           navigate('/menu');
//         }, 1000);
//       } else {
//         const errorData = await response.json();
//         // Error toast with specific error message
//         toast.error(`Failed to add menu item: ${errorData.message || 'Unknown error'}`);
//       }
//     } catch (error) {
//       console.error('Error adding menu item:', error);
//       // Error toast for exception with more detailed message
//       toast.error(`An error occurred: ${error.message || 'Unknown error'}`);
//     }
//   };

//   // Categories to choose from
//   const availableCategories = [
//     'Momo', 'Salads', 'Wai-Wai-sadheko', 'Burgers', 'Pasta', 'Pizza', 
//     'Fride-rice', 'Main Courses', 'Desserts', 'Sandwiches',
//     'Vegan', 'Lunch', 'Chowmein', 'Specials',
//     "Cold-drinks", "Hot-drinks"
//   ];

//   // Types of items
//   const itemTypes = ['Vegetarian', 'Non-vegetarian', 'Drinks', 'Breakfast'];
  
//   // Menu types
//   const menuTypes = ['normal', 'todays-special'];

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="fixed left-0 top-0 h-full">
//         <Nav />
//       </div>

//       <div className="flex-1 ml-16 md:ml-64 p-4">
//         <div className="max-w-3xl mx-auto">
//           <div className="p-4">
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
//             >
//               Back
//             </button>
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Menu Item</h1>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                   Dish Name*
//                 </label>
//                 <input
//                   id="title"
//                   type="text"
//                   name="title"
//                   value={itemData.title}
//                   onChange={handleChange}
//                   placeholder="Enter dish name"
//                   className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-xs mt-1 error-message">{errors.title}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (Rs)*
//                 </label>
//                 <input
//                   id="price"
//                   type="number"
//                   name="price"
//                   value={itemData.price}
//                   onChange={handleChange}
//                   placeholder="Enter price"
//                   className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                 />
//                 {errors.price && (
//                   <p className="text-red-500 text-xs mt-1 error-message">{errors.price}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
//                   Food Type*
//                 </label>
//                 <select
//                   id="type"
//                   name="type"
//                   value={itemData.type}
//                   onChange={handleChange}
//                   className={`w-full p-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                 >
//                   <option value="" disabled>Select a type</option>
//                   {itemTypes.map((type, index) => (
//                     <option key={index} value={type.toLowerCase()}>{type}</option>
//                   ))}
//                 </select>
//                 {errors.type && (
//                   <p className="text-red-500 text-xs mt-1 error-message">{errors.type}</p>
//                 )}
//               </div>
              
//               <div>
//                 <label htmlFor="menuType" className="block text-sm font-medium text-gray-700 mb-1">
//                   Menu Type*
//                 </label>
//                 <select
//                   id="menuType"
//                   name="menuType"
//                   value={itemData.menuType}
//                   onChange={handleChange}
//                   className={`w-full p-2 border ${errors.menuType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                 >
//                   <option value="" disabled>Select a type</option>
//                   {menuTypes.map((menuType, index) => (
//                     <option key={index} value={menuType}>
//                       {menuType === 'normal' ? 'Normal' : 'Today\'s Special'}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.menuType && (
//                   <p className="text-red-500 text-xs mt-1 error-message">{errors.menuType}</p>
//                 )}
//               </div>

//               <div className="md:col-span-2">
//                 <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
//                   Item Image*
//                 </label>
//                 <div className="flex flex-col space-y-2">
//                   <input
//                     ref={fileInputRef}
//                     id="image"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className={`w-full p-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
//                   />
//                   {errors.image && (
//                     <p className="text-red-500 text-xs mt-1 error-message">{errors.image}</p>
//                   )}
                  
//                   {imagePreview && (
//                     <div className="mt-2">
//                       <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
//                         <img 
//                           src={imagePreview} 
//                           alt="Item preview" 
//                           className="w-full h-full object-contain"
//                         />
//                         <button
//                           type="button"
//                           onClick={clearImage}
//                           className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Menu Categories*
//                 </label>
//                 <div className={`grid grid-cols-2 gap-2 p-2 border ${errors.categories ? 'border-red-500' : 'border-gray-300'} rounded-md`}>
//                   {availableCategories.map((category, index) => (
//                     <div key={index} className="flex items-center">
//                       <input
//                         id={`category-${index}`}
//                         type="checkbox"
//                         name="categories"
//                         className="h-4 w-4"
//                         checked={itemData.categories.includes(category.toLowerCase())}
//                         onChange={() => toggleCategory(category)}
//                       />
//                       <label htmlFor={`category-${index}`} className="ml-2 text-sm">{category}</label>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.categories && (
//                   <p className="text-red-500 text-xs mt-1 error-message">{errors.categories}</p>
//                 )}
//               </div>
//             </div>

//             <div className="pt-4">
//               <button
//                 type="submit"
//                 className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700"
//               >
//                 ADD MENU ITEM
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateItem;

import React, { useState, useRef } from 'react';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function CreateItem() {
  const [itemData, setItemData] = useState({
    title: '',
    price: '',
    type: '',
    menuType: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({
      ...itemData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);

      setItemData({
        ...itemData,
        image: file
      });

      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setItemData({
      ...itemData,
      image: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success('Image removed');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemData.title.trim()) newErrors.title = 'Dish name is required';
    if (!itemData.price) newErrors.price = 'Price is required';
    else if (parseFloat(itemData.price) <= 0) newErrors.price = 'Price must be greater than zero';
    if (!itemData.type) newErrors.type = 'Food type is required';
    if (!itemData.menuType) newErrors.menuType = 'Menu type is required';
    if (!itemData.image) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const errorFields = Object.keys(errors).map(
        field => field.charAt(0).toUpperCase() + field.slice(1)
      ).join(', ');
      toast.error(`Please complete required fields: ${errorFields}`);
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', itemData.title.trim());
      formData.append('price', itemData.price);
      formData.append('type', itemData.type);
      formData.append('menuType', itemData.menuType);
      formData.append('image', itemData.image);

      const loadingToast = toast.loading('Adding menu item...');
      toast(`Adding ${itemData.title} to the menu`, { icon: '🍽️' });

      const response = await fetch('http://localhost:4000/api/staff/add-menu-items', {
        method: 'POST',
        body: formData
      });

      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success(`${itemData.title} added successfully to the menu!`, {
          icon: '✅',
          duration: 4000
        });
        setTimeout(() => navigate('/menu'), 1000);
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add menu item: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`);
    }
  };

  const itemTypes = ['Vegetarian', 'Non-vegetarian'];
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Dish Name*
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={itemData.title}
                  onChange={handleChange}
                  placeholder="Enter dish name"
                  className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 error-message">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs)*
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={itemData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className={`w-full p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1 error-message">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Type*
                </label>
                <select
                  id="type"
                  name="type"
                  value={itemData.type}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                >
                  <option value="" disabled>Select a type</option>
                  {itemTypes.map((type, index) => (
                    <option key={index} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1 error-message">{errors.type}</p>
                )}
              </div>

              <div>
                <label htmlFor="menuType" className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Type*
                </label>
                <select
                  id="menuType"
                  name="menuType"
                  value={itemData.menuType}
                  onChange={handleChange}
                  className={`w-full p-2 border ${errors.menuType ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                >
                  <option value="" disabled>Select a type</option>
                  {menuTypes.map((menuType, index) => (
                    <option key={index} value={menuType}>
                      {menuType === 'normal' ? 'Normal' : 'Today\'s Special'}
                    </option>
                  ))}
                </select>
                {errors.menuType && (
                  <p className="text-red-500 text-xs mt-1 error-message">{errors.menuType}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Image*
                </label>
                <div className="flex flex-col space-y-2">
                  <input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full p-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1 error-message">{errors.image}</p>
                  )}

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
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-md hover:bg-gray-700"
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
