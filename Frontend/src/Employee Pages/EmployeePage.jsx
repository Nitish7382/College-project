import React, { useState, useEffect } from "react";
import Navbar from "./EmployeeNavbar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  getAssignments,
  getCourseProgress,
  updateCourseProgress,
  getEmployeeAssessments,
} from "../Api";

function EmployeePage() {
  const [isProgressDropdownOpen, setIsProgressDropdownOpen] = useState(false);
  const [isLearningDropdownOpen, setIsLearningDropdownOpen] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [newProgressPercentage, setNewProgressPercentage] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [ongoingAssignmentsCount, setOngoingAssignmentsCount] = useState(0);
  const [completedAssignmentsCount, setCompletedAssignmentsCount] = useState(0);
  const [totalAssignmentsCount, setTotalAssignmentsCount] = useState(0);
  const [completedCourses, setCompletedCourses] = useState([]);

  const navigator = useNavigate();

  const toggleProgressDropdown = () => {
    setIsProgressDropdownOpen(!isProgressDropdownOpen);
  };

  const toggleLearningDropdown = () => {
    setIsLearningDropdownOpen(!isLearningDropdownOpen);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const mockAssignments = await getAssignments();
        setAssignments(mockAssignments);
        setTotalAssignmentsCount(mockAssignments.length);
        setOngoingAssignmentsCount(
          mockAssignments.filter(
            (assignment) => assignment.status === "ASSIGNED"
          ).length
        );
        setCompletedAssignmentsCount(
          mockAssignments.filter(
            (assignment) => assignment.status === "COMPLETED"
          ).length
        );
      } catch (error) {
        console.error("Error fetching assigned courses:", error);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        const data = await getCourseProgress();
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching course progress:", error);
      }
    };

    fetchCourseProgress();
  }, []);

  useEffect(() => {
    const fetchEmployeeAssessments = async () => {
      try {
        const EmployeeAssessments = await getEmployeeAssessments();
        const passedCourses = EmployeeAssessments.filter(
          (EmployeeAssessment) => EmployeeAssessment.result === "PASS"
        ).map(
          (EmployeeAssessment) => EmployeeAssessment.assessment.course.courseId
        );

        setCompletedCourses(passedCourses);
      } catch (error) {
        console.error("Error fetching employee assessments:", error);
      }
    };

    fetchEmployeeAssessments();
  }, []);

  const openUpdateModal = (progress) => {
    setSelectedProgress(progress);
    setIsUpdateModalOpen(true);
  };

  const takeAssessment = (progress) => {
    navigator("/takeassessment", {
      state: {
        courseId: progress.course.courseId,
        employeeId: progress.employee.employeeId,
      },
    });
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProgress(null);
    setNewProgressPercentage("");
  };

  const handleUpdateProgress = async () => {
    if (!newProgressPercentage || isNaN(newProgressPercentage)) {
      alert("Please enter a valid progress percentage!");
      return;
    }

    const updatedProgress = {
      courseId: selectedProgress.course.courseId,
      employeeId: selectedProgress.employee.employeeId,
      progressPercentage: Number(newProgressPercentage),
      status: selectedProgress.status,
    };

    try {
      await updateCourseProgress(updatedProgress);
      Swal.fire("Success!", "Progress updated successfully!", "success");
      closeUpdateModal();

      const updatedData = await getCourseProgress();
      setProgressData(updatedData);
    } catch (error) {
      console.error("Error updating progress:", error);
      Swal.fire("Error!", "Error updating progress:", "error")
    }
  };

  const handleViewClick = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleClosePopup = () => {
    setSelectedAssignment(null);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch =
      url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/) ||
      url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  return (
    <div className="min-h-screen bg-gray-300">
      <Navbar />
      <h2 className="text-center text-3xl font-bold mt-8">Employee Dashboard</h2>
      <div className="flex justify-center mt-8 space-x-4">
        <div className="bg-blue-300 p-6 rounded-3xl w-1/4 text-center transform hover:-translate-y-2">
          <h3 className="text-lg font-semibold">Total Courses Assigned</h3>
          <p className="text-4xl font-bold">{totalAssignmentsCount}</p>
        </div>
        <div className="bg-green-300 p-6 rounded-3xl w-1/3 text-center transform hover:-translate-y-2">
          <h3 className="text-lg font-semibold">Total Courses OnGoing</h3>
          <p className="text-4xl font-bold">{ongoingAssignmentsCount}</p>
        </div>
        <div className="bg-yellow-300 p-6 rounded-3xl w-1/4 text-center transform hover:-translate-y-2">
          <h3 className="text-lg font-semibold">Total Courses Completed</h3>
          <p className="text-4xl font-bold">{completedAssignmentsCount}</p>
        </div>
      </div>

      <div className="mt-8 space-y-4 px-8">
        <div
          className="bg-purple-400 p-6 rounded-lg text-xl font-semibold cursor-pointer transform"
          onClick={toggleLearningDropdown}
        >
          My Learning
        </div>
        {isLearningDropdownOpen && (
          <div className="bg-white p-4 rounded-lg shadow-lg mt-2">
            <ul className="list-disc list-inside mt-4 space-y-2">
              {assignments.map((assignment, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    Course {index + 1} :{" "}
                    {assignment.course.courseName}
                  </span>
                  <button
                    onClick={() => handleViewClick(assignment)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="bg-blue-400 p-6 rounded-lg text-xl font-semibold cursor-pointer transform"
          onClick={toggleProgressDropdown}
        >
          My Progress
        </div>
        {isProgressDropdownOpen && (
          <div className="bg-white p-4 rounded-lg shadow-lg mt-2 space-y-4">
            <h4 className="text-lg font-semibold">Course Progress</h4>
            {progressData.map((progress, index) => {
              const progressColors = [
                "bg-green-500",
                "bg-blue-500",
                "bg-red-500",
                "bg-yellow-500",
                "bg-purple-500",
              ];
              const progressColor =
                progressColors[index % progressColors.length];

              const isCompleted = completedCourses.includes(
                progress.course.courseId
              );

              return (
                <div key={progress.progressId} className="mt-4">
                  <p className="text-sm font-semibold">
                    {index + 1}:{" "}
                    {progress.course.courseName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-300 rounded-full h-4">
                      <div
                        className={`${progressColor} h-4 rounded-full`}
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>
                    <button
                      className={`text-white px-4 py-1 rounded ${
                        isCompleted
                          ? "bg-gray-400 cursor-not-allowed"
                          : progress.progressPercentage === 100
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      disabled={isCompleted}
                      onClick={() =>
                        !isCompleted &&
                        (progress.progressPercentage === 100
                          ? takeAssessment(progress)
                          : openUpdateModal(progress))
                      }
                    >
                      {isCompleted
                        ? "COMPLETED"
                        : progress.progressPercentage === 100
                        ? "Take Assessment"
                        : "Update"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isUpdateModalOpen && selectedProgress && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Update Progress for {selectedProgress.course.courseName}
            </h3>
            <input
              type="number"
              placeholder="Enter new progress percentage"
              value={newProgressPercentage}
              onChange={(e) => setNewProgressPercentage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeUpdateModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProgress}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAssignment && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {selectedAssignment.course.courseName}
            </h3>
            <p>
              <strong>KeyConcepts:</strong> {selectedAssignment.course.keyConcepts}
            </p>
            <p>
              <strong>Duration:</strong> {selectedAssignment.course.duration}
            </p>
            <p>
              <strong>Resource Links:</strong>{" "}
              {selectedAssignment.course.resourceLinks.includes("youtube.com") ||
              selectedAssignment.course.resourceLinks.includes("youtu.be") ? (
                <iframe
                  className="w-full h-60 rounded-md"
                  src={getYouTubeEmbedUrl(selectedAssignment.course.resourceLinks)}
                  title={`YouTube video for ${selectedAssignment.course.courseName}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <a
                  href={selectedAssignment.course.resourceLinks}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedAssignment.course.resourceLinks}
                </a>
              )}
            </p>
            <button
              onClick={handleClosePopup}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeePage;
