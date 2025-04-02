import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    role: "",
    phone: "",
    email: "",
    password: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const roles = ["Waiter", "Cash Counter Staff", "Chef"];

  // Fetch all staff
  const getAllStaff = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/get-all-staffs");
      setStaffList(response.data.staffs);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (/^\d*$/.test(value) && value.length <= 10)) {
      setFormData({ ...formData, phone: value });
      setPhoneError(false);
    } else if (name === "phone" && value.length > 10) {
      setPhoneError(true);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, role, phone, email, password } = formData;

    if (!name || !role || !phone || !email || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      if (editIndex !== null) {
        // Update staff
        const response = await axios.put(`http://localhost:4000/api/admin/update-staffs/${id}`, {
          name,
          role,
          phone,
          email,
          password,
        }); 
        alert(response.data.message);
      } else {
        // Add new staff
        const response = await axios.post("http://localhost:4000/api/admin/register-staff", {
          name,
          role,
          phone,
          email,
          password,
        });
        alert(response.data.message);
      }
      getAllStaff(); // Refresh staff list after add or update
      resetForm();
    } catch (error) {
      console.error("Error submitting staff:", error);
    }
  };

  // Reset form after submit
  const resetForm = () => {
    setFormData({ id: null, name: "", role: "", phone: "", email: "", password: "" });
    setEditIndex(null);
  };

  // Handle edit button
  const handleEdit = (index) => {
    setFormData({ ...staffList[index], id: staffList[index]._id });
    setEditIndex(index);
  };

  // Handle delete button
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure want to delete?")
    if(!confirmDelete) return
    try {
      const response = await axios.delete(`http://localhost:4000/api/admin/delete-staff/${id}`);
      alert(response.data.message);
      getAllStaff(); // Refresh staff list after delete
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  return (
    
    <div className="flex min-h-screen">
      <div className="p-8 bg-gray-50 flex-1 transform translate-x-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin - Staff Management</h1>

        {/* Staff Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter staff name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Role</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {phoneError && <p className="text-red-500 text-sm">Phone number should be 10 digits.</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "password" : "text"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {editIndex !== null ? "Update Staff" : "Add Staff"}
          </button>
        </form>

        {/* Staff Table */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Total Staff</h2>
          {staffList.length === 0 ? (
            <p className="text-gray-600">No staff added yet.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Role</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Phone</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, index) => (
                  <tr key={staff._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{staff.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{staff.role}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{staff.phone}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-800">{staff.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-md hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staff._id)}
                        className="bg-red-500 text-white font-bold py-1 px-3 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
