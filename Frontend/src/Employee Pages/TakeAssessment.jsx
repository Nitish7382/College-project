import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAssessment, submitAssessment } from "../Api";
import Swal from "sweetalert2";

const TakeAssessment = () => {
  const location = useLocation();
  const { courseId, employeeId } = location.state || {};
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Timer state
  const [pauseModalOpen, setPauseModalOpen] = useState(false); // Pause modal state

  const timerRef = useRef(null); // Reference for the timer
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false); // To avoid duplicate submissions

  const handleback = () => {
    navigate("/employee"); // Redirect to the employee home page
  };

  useEffect(() => {
    // Fetch the assessment on load
    const fetchAssessment = async () => {
      try {
        const data = await getAssessment(courseId);
        setAssessment(data);
        setAnswers(new Array(data.questions.length).fill("")); // Initialize answers
        setTimeLeft(data.duration * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Error fetching assessment:", error);
      }
    };

    fetchAssessment();
  }, [courseId]);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          clearInterval(timerRef.current); // Ensure timer stops
          return 0; // Prevent negative time
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, [isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // If timer hits 0, trigger submission
    if (seconds === 0 && !isAutoSubmitting) {
      setIsAutoSubmitting(true); // Prevent duplicate submission
      handleSubmit();
    }

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleOptionChange = (questionIndex, option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = option;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    setPauseModalOpen(false);
    clearInterval(timerRef.current); // Stop the timer on submission
    const submissionData = {
      assessmentId: assessment.assessmentId,
      employeeId: employeeId,
      answers,
    };

    try {
      const result = await submitAssessment(submissionData);
      if (result === "Congratulations!! Assessment Cleared Successfully!!") {
        Swal.fire({
          icon: "success",
          title: "Congratulations!",
          text: "You have successfully passed the assessment!",
          confirmButtonText: "Give Feedback",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/givefeedback", {
              state: { courseId, employeeId },
            });
          } else {
            navigate("/employee");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Assessment Failed",
          text: "Please try again.",
          confirmButtonText: "Return to Home",
        }).then(() => navigate("/employee"));
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your assessment. Please try again.",
      });
    }
  };

  const handlePause = () => {
    clearInterval(timerRef.current);
    setIsPaused(true);
    setPauseModalOpen(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setPauseModalOpen(false);
  };

  if (!assessment) return <p>Loading assessment...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Assessment: {assessment.course.courseName}</h1>
      <p className="text-sm text-gray-600 mb-2">Duration: {assessment.duration} minutes</p>
      <p className="text-sm text-red-500 mb-6">Time Remaining: {formatTime(timeLeft)}</p>
      <div className="space-y-6">
        {assessment.questions.map((question, index) => (
          <div key={question.questionId} className="p-4 bg-white shadow rounded-lg">
            <p className="font-medium">
              {index + 1}. {question.questionText}
            </p>
            <div className="mt-2 space-y-2">
              {["A", "B", "C", "D"].map((option, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={question[`option${option}`]}
                    checked={answers[index] === question[`option${option}`]}
                    onChange={() => handleOptionChange(index, question[`option${option}`])}
                  />
                  <span>{question[`option${option}`]}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
        <button
          onClick={handlePause}
          className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Pause
        </button>
      </div>

      {/* Pause Modal */}
      {pauseModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Paused</h2>
            <p className="mb-6">Do you want to resume or end the test?</p>
            <div className="flex space-x-4">
              <button
                onClick={handleResume}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Resume
              </button>
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                End Test
              </button>
              <button
                onClick={handleback}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeAssessment;
