import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function MenuManage() {
  // State for menu items
  const [menuItems, setMenuItems] = useState([])
  
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('name-asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Items per page
  const itemsPerPage = 5
  
  // Fetch menu items from API
  useEffect(() => {
    fetchMenuItems()
  }, [])
  
  const fetchMenuItems = async () => {
    try {
      setIsLoading(true)
      // Fixed API endpoint
      const response = await fetch('http://localhost:4000/api/staff/get-all-menu')
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      setMenuItems(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch menu items. Please try again later.')
      console.error('Error fetching menu items:', err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle delete item
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`http://localhost:4000/api/staff/delete-menu/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        // Refresh menu items
        fetchMenuItems()
      } catch (err) {
        console.error('Error deleting menu item:', err)
        alert('Failed to delete menu item. Please try again.')
      }
    }
  }
  
  // Handle sort
  const handleSort = (e) => {
    setSortOption(e.target.value)
  }
  
  // Get sorted and filtered items
  const getSortedAndFilteredItems = () => {
    let filtered = [...menuItems]
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Sort items - Uncommented and fixed to use title instead of name
    switch (sortOption) {
      case 'name-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break   
      default:
        break
    }
    
    return filtered
  }
  
  // Pagination logic
  const totalPages = Math.ceil(getSortedAndFilteredItems().length / itemsPerPage)
  const paginatedItems = getSortedAndFilteredItems().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Helper function to safely format price
  const formatPrice = (price) => {
    // Check if price is a number before using toFixed
    if (typeof price === 'number') {
      return price.toFixed(2)
    }
    // Fallback for non-number values
    return parseFloat(price).toFixed(2)
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full flex flex-col">
      {/* Header - Fixed at top */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your menu items here</p>
        </div>
        <div className="mt-3 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Link to= '/menu/add-menu'>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center text-sm"
          >
            <span className="mr-1">+</span> Add New Menu
          </button>
          </Link>
        </div>
      </div>
      
      {/* Filters - Fixed below header */}
      <div className="bg-white p-3 rounded-lg shadow-md mb-4 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="md:w-1/3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
            <select 
              value={sortOption}
              onChange={handleSort}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
          <div className="md:w-2/3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <input 
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* Menu Items Table - Scrollable */}
      <div className="bg-white rounded-lg shadow-md flex flex-col flex-grow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : menuItems.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No menu items found. Add your first menu item!</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="overflow-y-auto max-h-96 md:max-h-[calc(100vh-280px)]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden">
                          {item.image ? (
                            <img src={`http://localhost:4000${item.image}`} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">No IMG</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Rs {formatPrice(item.price)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <Link to={`/menu/edit-menu/${item._id}`}>
                          <button 
                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                          >
                            Edit
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Pagination - Fixed at bottom */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sticky bottom-0">
            <div className="flex items-center justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  &lt;
                </button>
                
                {/* Page numbers - Show limited page numbers for better mobile experience */}
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  // Calculate which page numbers to show based on current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuManage