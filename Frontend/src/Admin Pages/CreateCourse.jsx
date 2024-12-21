import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createCourse } from "../Api";


function CreateCourse() {
  const [formData, setFormData] = useState({
    courseName: "",
    keyConcepts: "",
    duration: "",
    resourceLinks: "",
    otherLinks: "",
    outcomes: "",
  });
  const [message, setMessage] = useState("");

  const navigator = useNavigate();
  const location = useLocation();
  const { requestId } = location.state || {}; // Retrieve requestId from state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createCourse(requestId, formData);
      console.log(formData);
      if (response.data == "Course Created Successfully") {
        console.log(response.data);
        setMessage(response.message || "Course Created Successfully");
        Swal.fire("Success!", "Course Created Successfully!", "success");
        navigator("/courselist");
      } else {
        Swal.fire("Error!", "Failed to create requested Course", "error");
        console.log("Error : " + response.data);
        navigator("/admin");
      }
    } catch (error) {
        
      setMessage(error.response?.data?.message || "Request creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-center text-2xl font-bold mb-6">Create Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.courseName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="keyConcepts"
              placeholder="key Concepts"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.keyConcepts}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="resourceLinks"
              placeholder="Resource Links"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.resourceLinks}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="otherLinks"
              placeholder="Other Links"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.otherLinks}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="outcomes"
              placeholder="Outcomes"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.outcomes}
              onChange={handleChange}
            />
          </div>
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

export default CreateCourse;
