import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses, getAllAssessments } from "../Api";
import Navbar from "./AdminNavbar";
import { FaEdit, FaUserPlus, FaGraduationCap } from "react-icons/fa"; // Importing icons

const CourseList = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const mockAllCourses = await getAllCourses();
        const mockAllAssessments = await getAllAssessments();
        setAllCourses(mockAllCourses);
        const assessmentMap = mockAllAssessments.data.reduce(
          (acc, assessment) => {
            acc[assessment.course.courseId] = assessment;
            return acc;
          },
          {}
        );
        setAssessments(assessmentMap);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    navigator("/createCourse");
  };

  const handleEditCourse = (course) => {
    try {
      navigator("/editCourse", { state: { course } });
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    }
  };

  const handleAddLearners = (course) => {
    try {
      navigator("/courseassign", { state: { course } });
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    }
  };

  const handleAssessment = (course, assessmentExists) => {
    if (assessmentExists) {
      const assessmentDetails = assessments[course.courseId];
      navigator("/updateassessment", { state: { assessmentDetails } });
    } else {
      navigator("/createassessment", { state: { course } });
    }
  };

  const closeCard = () => {
    setSelectedCourse(null);
  };

  const extractYouTubeId = (url) => {
    try {
      const youtubeUrl = new URL(url);
      if (youtubeUrl.hostname === "youtu.be") {
        return youtubeUrl.pathname.slice(1);
      } else if (youtubeUrl.hostname.includes("youtube.com")) {
        return youtubeUrl.searchParams.get("v");
      }
      return null;
    } catch (error) {
      console.error("Invalid YouTube URL:", url);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Navbar */}
      <Navbar />

      {/* Back and Add Course Buttons */}
      <div className="p-6 space-x-4">
        <button
          onClick={handleCreateCourse}
          className="mb-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          <FaUserPlus className="mr-2" /> Create Course
        </button>
      </div>

      {/* Course List */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Course List</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {allCourses.map((course, index) => {
            const videoId = extractYouTubeId(course.resourceLinks);
            const assessmentExists = assessments[course.courseId] !== undefined;

            return (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50 rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedCourse(course)} // Make card clickable
              >
                <h4 className="text-xl font-medium text-black mb-2">{course.courseName}</h4>
                <p className="text-gray-600">{course.keyConcepts}</p>
                <p className="text-gray-600">{course.duration}</p>

                {/* Embed YouTube Video */}
                {videoId && (
                  <div className="mt-4 aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Video for ${course.courseName}`}
                      allowFullScreen
                      frameBorder="0"
                      className="w-full h-52 rounded-md"
                    ></iframe>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      handleEditCourse(course);
                    }}
                    className="px-4 py-2 max-h-10 w-24 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      handleAddLearners(course);
                    }}
                    className="px-4 py-2 max-h-10 w-36 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <FaUserPlus className="mr-2" /> Add Learners
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      handleAssessment(course, assessmentExists);
                    }}
                    className={`px-4 py-2 max-h-10 w-44 ${
                      assessmentExists
                        ? "bg-yellow-500 hover:bg-yellow-700"
                        : "bg-emerald-600 hover:bg-emerald-800"
                    } text-white rounded-md transition-colors flex items-center justify-center`}
                  >
                    <FaGraduationCap className="mr-2" />
                    {assessmentExists ? "Update Assessment" : "Create Assessment"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-lg rounded-md w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={closeCard}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold">Course Details</h2>
            <p>
              <strong>Course Name:</strong> {selectedCourse.courseName}
            </p>
            <p>
              <strong>Key Concepts:</strong> {selectedCourse.keyConcepts}
            </p>
            <p>
              <strong>Duration:</strong> {selectedCourse.duration}
            </p>
            <p>
              <strong>Outcomes:</strong> {selectedCourse.outcomes}
              {selectedCourse.resourceLinks &&
                extractYouTubeId(selectedCourse.resourceLinks) && (
                  <div className="mt-4 aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(
                        selectedCourse.resourceLinks
                      )}`}
                      title="Course Video"
                      allowFullScreen
                      frameBorder="0"
                      className="w-full h-96 rounded-md"
                    ></iframe>
                  </div>
                )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
