import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createRequest, getAllEmployees } from "../Api";

function Managerrequest() {
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    concepts: "",
    duration: "",
    employeePosition: "",
    requiredEmployees: [], // To store selected employee objects
  });

  const [employees, setEmployees] = useState([]); // Store fetched employee data
  const [message, setMessage] = useState(""); // For success/error messages
  const navigate = useNavigate(); // Navigation hook

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        setEmployees(response); // Assuming response.data contains the employee list
        console.log("From Manger request page" + employees);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle employee selection from dropdown
  const handleEmployeeSelect = (e) => {
    const employeeId = parseInt(e.target.value, 10);
    const selectedEmployee = employees.find((emp) => emp.employeeId === employeeId);

    if (selectedEmployee && !formData.requiredEmployees.some((emp) => emp.employeeId === employeeId)) {
      setFormData((prev) => ({
        ...prev,
        requiredEmployees: [...prev.requiredEmployees, selectedEmployee],
      }));
    }
  };

  // Handle removal of selected employee
  const handleRemoveEmployee = (employeeId) => {
    setFormData((prev) => ({
      ...prev,
      requiredEmployees: prev.requiredEmployees.filter((emp) => emp.employeeId !== employeeId),
    }));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRequest(formData);
      if (response.data === "Request created successfully") {
        setMessage("Request created successfully");
        Swal.fire("Success!", "Request created successfully", "success");
        navigate("/manager");
      } else {
        setMessage(response.data || "Request creation failed");
        Swal.fire("Error!", "Request creation failed", "error");

      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Request creation failed");
      Swal.fire("Error!", "Request creation failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-6">Create Request</h2>
        {message && (
          <p
            className={`text-center font-medium mb-4 ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          {["courseName", "description", "concepts", "duration", "employeePosition"].map((field) => (
            <div className="mb-4" key={field}>
              <input
                type="text"
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1").trim()} // Format placeholder nicely
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Employee Dropdown */}
          <div className="mb-4">
            <label htmlFor="employees" className="block font-medium mb-2">
              Select Employees:
            </label>
            <select
              id="employees"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleEmployeeSelect}
            >
              <option value="">Select an Employee</option>
            
                {employees.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.accountName} - {employee.email}
                  </option>
                ))}
            </select>
          </div>

          {/* Selected Employees List */}
          <div className="mb-4">
            <h4 className="font-medium">Selected Employees:</h4>
            {formData.requiredEmployees.length > 0 ? (
              formData.requiredEmployees.map((emp) => (
                <div
                  key={emp.employeeId}
                  className="flex justify-between items-center bg-gray-200 p-2 rounded-lg mt-2"
                >
                  <span>{emp.accountName}</span>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveEmployee(emp.employeeId)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No employees selected.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default Managerrequest;
