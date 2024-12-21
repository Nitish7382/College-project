import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './AdminNavbar';
import { getAllRequests, getRequestById } from '../Api';

function Admin() {
  const [allrequests, setAllRequests] = useState([]);
  const [totalRequestsCount, setTotalRequestsCount] = useState(0);
  const [respondedRequests, setRespondedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState(0);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const mockAllRequests = await getAllRequests();
        setAllRequests(mockAllRequests);
        setTotalRequestsCount(mockAllRequests.length);
        setRespondedRequests(mockAllRequests.filter(r => r.status !== 'PENDING'));
        setPendingRequests(mockAllRequests.filter(r => r.status === 'PENDING'));
        setCompletedRequests(mockAllRequests.filter(r => r.status === 'COMPLETED').length);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleViewRequest = async (request) => {
    try {
      const requestData = await getRequestById(request.requestId);
      navigator('/viewRequest', { state: { requestData } });
    } catch (error) {
      console.error("Failed to fetch request details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] to-[#cfdef3]">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-center text-[#4A47A3] mb-10">Admin Dashboard</h2>

        {/* Dashboard Summary */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-full shadow-md transform transition hover:scale-105">
            <p className="text-5xl font-bold text-center">{completedRequests}</p>
            <p className="text-xl font-medium text-center">Courses Created</p>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-full shadow-md transform transition hover:scale-105">
            <p className="text-5xl font-bold text-center">1</p>
            <p className="text-xl font-medium text-center">Employees</p>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-full shadow-md transform transition hover:scale-105">
            <p className="text-5xl font-bold text-center">{totalRequestsCount}</p>
            <p className="text-xl font-medium text-center">Requests</p>
          </div>
        </div>

        {/* Pending and Completed Requests */}
        <div className="grid grid-cols-2 gap-6">
          {/* Pending Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-yellow-500">
            <h3 className="text-xl font-semibold mb-4 text-yellow-600">Pending Requests</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Sl No</th>
                  <th className="p-3">Manager Name</th>
                  <th className="p-3">Training Program</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{request.managerUsername}</td>
                    <td className="p-3">{request.courseName}</td>
                    <td className="p-3">
                      <button
                        className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
                        onClick={() => handleViewRequest(request)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Completed Requests */}
          <div className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-green-500">
            <h3 className="text-xl font-semibold mb-4 text-green-600">Completed Requests</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Sl No</th>
                  <th className="p-3">Manager Name</th>
                  <th className="p-3">Training Program</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {respondedRequests.map((request, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{request.managerUsername}</td>
                    <td className="p-3">{request.courseName}</td>
                    <td className="p-3">
                      <button
                        className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                        onClick={() => handleViewRequest(request)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
