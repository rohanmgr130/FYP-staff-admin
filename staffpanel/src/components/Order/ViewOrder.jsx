import React, { useState } from 'react';
import { FaSearch, FaEdit, FaCheck, FaTimes, FaPrint, FaExclamationTriangle } from 'react-icons/fa';

const ViewOrder = () => {
  // Sample data - in a real application, this would come from an API
  const initialOrders = [
    {
      id: "#ORD-5782",
      customer: "John Smith",
      items: [
        { name: "Margherita Pizza", quantity: 2, price: "Rs 25.98" },
        { name: "Cheeseburger", quantity: 1, price: "Rs 9.99" }
      ],
      total: "Rs 35.97",
      status: "Preparing",
      time: "12:45 PM",
      paymentStatus: "Paid",
      notes: "No onions on the burger please."
    },
    {
      id: "#ORD-5783",
      customer: "Alice Johnson",
      items: [
        { name: "Spaghetti Carbonara", quantity: 1, price: "Rs 14.99" },
        { name: "Caesar Salad", quantity: 1, price: "Rs 8.99" },
        { name: "Tiramisu", quantity: 1, price: "Rs 7.99" }
      ],
      total: "Rs 31.97",
      status: "Ready",
      time: "12:30 PM",
      paymentStatus: "Paid",
      notes: ""
    },
    {
      id: "#ORD-5784",
      customer: "Robert Davis",
      items: [
        { name: "Pepperoni Pizza", quantity: 1, price: "Rs 13.99" },
        { name: "Garlic Bread", quantity: 1, price: "Rs 4.99" },
        { name: "Coke", quantity: 2, price: "Rs 3.98" }
      ],
      total: "Rs 22.96",
      status: "Delivered",
      time: "12:15 PM",
      paymentStatus: "Paid",
      notes: ""
    },
    {
      id: "#ORD-5785",
      customer: "Emma Wilson",
      items: [
        { name: "Veggie Burger", quantity: 2, price: "Rs 21.98" },
        { name: "Sweet Potato Fries", quantity: 1, price: "Rs 5.99" },
        { name: "Lemonade", quantity: 2, price: "Rs 5.98" }
      ],
      total: "Rs 33.95",
      status: "New",
      time: "1:00 PM",
      paymentStatus: "Pending",
      notes: "Extra sauce on the side."
    },
    {
      id: "#ORD-5786",
      customer: "Michael Brown",
      items: [
        { name: "Chicken Wings", quantity: 2, price: "Rs 19.98" },
        { name: "Mozzarella Sticks", quantity: 1, price: "Rs 7.99" },
        { name: "Chocolate Brownie", quantity: 1, price: "Rs 6.99" }
      ],
      total: "Rs 34.96",
      status: "Confirmed",
      time: "1:15 PM",
      paymentStatus: "Paid",
      notes: "Ring doorbell upon arrival."
    }
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  // Status options
  const statusOptions = ["All", "New", "Confirmed", "Preparing", "Ready","Cancelled"];

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case "New": return "bg-blue-500";
      case "Confirmed": return "bg-purple-500";
      case "Preparing": return "bg-yellow-500";
      case "Ready": return "bg-green-500";
      case "Cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    // Apply search filter
    const searchMatch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply status filter
    const statusMatch = statusFilter === "All" || order.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  // Toggle order details
  const toggleOrderDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Update order status
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  // Handle edit mode
  const startEditing = (order) => {
    setEditingOrder({ ...order });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  const saveEditing = () => {
    setOrders(orders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    ));
    setEditingOrder(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by order #, customer name, or item..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-auto">
              <select
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option} Status</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.id}</div>
                              <div className="text-sm text-gray-500">{order.customer}</div>
                              <div className="text-xs text-gray-500">{order.time}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx}>
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.total}</div>
                          <div className="text-xs text-gray-500">{order.paymentStatus}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(order);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.print();
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <FaPrint />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Order Details */}
                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Customer Details */}
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
                                <p className="text-sm">{order.customer}</p>
                                <p className="text-sm">{order.phone}</p>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                      <span>{item.quantity}x {item.name}</span>
                                      <span>{item.price}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between font-semibold text-sm pt-2 border-t">
                                    <span>Total</span>
                                    <span>{order.total}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Order Actions */}
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Update Status</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {statusOptions.filter(s => s !== "All").map(status => (
                                    <button
                                      key={status}
                                      onClick={() => updateStatus(order.id, status)}
                                      className={`px-2 py-1 text-xs rounded ${
                                        order.status === status 
                                          ? `${getStatusColor(status)} text-white` 
                                          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                                
                                {order.notes && (
                                  <div className="mt-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                                    <div className="bg-yellow-50 p-2 rounded border border-yellow-200 text-sm flex">
                                      <FaExclamationTriangle className="text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                                      <p>{order.notes}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                      No orders found matching your filters. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Order {editingOrder.id}</h2>
                <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Information */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.customer}
                    onChange={(e) => setEditingOrder({...editingOrder, customer: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.phone}
                    onChange={(e) => setEditingOrder({...editingOrder, phone: e.target.value})}
                  />
                </div>

                {/* Order Status */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Order Status</label>
                  <select
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                  >
                    {statusOptions.filter(s => s !== "All").map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Payment Status</label>
                  <select
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingOrder.paymentStatus}
                    onChange={(e) => setEditingOrder({...editingOrder, paymentStatus: e.target.value})}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                {/* Order Items */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Order Items</label>
                  {editingOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="number"
                        className="w-16 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => {
                          const newItems = [...editingOrder.items];
                          newItems[index].quantity = parseInt(e.target.value) || 1;
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                      />
                      <input
                        type="text"
                        className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...editingOrder.items];
                          newItems[index].name = e.target.value;
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                      />
                      <input
                        type="text"
                        className="w-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...editingOrder.items];
                          newItems[index].price = e.target.value;
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                      />
                      <button
                        className="p-2 text-red-500 hover:text-red-700"
                        onClick={() => {
                          const newItems = editingOrder.items.filter((_, i) => i !== index);
                          setEditingOrder({...editingOrder, items: newItems});
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      const newItems = [...editingOrder.items, { name: "", quantity: 1, price: "$0.00" }];
                      setEditingOrder({...editingOrder, items: newItems});
                    }}
                  >
                    Add Item
                  </button>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Order Notes</label>
                  <textarea
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={editingOrder.notes}
                    onChange={(e) => setEditingOrder({...editingOrder, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditing}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;