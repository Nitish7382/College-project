import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Using a checkmark icon

const ThankYouPage = () => {
    const navigate = useNavigate();

    const handleBackToEmployee = () => {
        navigate("/employee");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50">
            {/* Animated Checkmark */}
            <div className="mb-6 animate-checkmark">
                <FaCheckCircle size={80} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
            <p className="text-gray-700 mb-6 text-lg">Your feedback has been successfully submitted.</p>
            <button
                onClick={handleBackToEmployee}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
            >
                Back to Employee Page
            </button>
        </div>
    );
};

export default ThankYouPage;
