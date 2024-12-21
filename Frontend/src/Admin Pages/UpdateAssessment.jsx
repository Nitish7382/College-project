import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { updateAssessment } from '../Api';

const UpdateAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentDetails } = location.state || {};

  const [totalMarks, setTotalMarks] = useState(assessmentDetails?.totalMarks || 0);
  const [passingMarks, setPassingMarks] = useState(assessmentDetails?.passingMarks || 0);
  const [duration, setDuration] = useState(assessmentDetails?.duration || 0);
  const [formQuestions, setFormQuestions] = useState([]);

  useEffect(() => {
    if (assessmentDetails?.questions) {
      const formattedQuestions = assessmentDetails.questions.map((q) => ({
        questionText: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctOption,
      }));
      setFormQuestions(formattedQuestions);
    }
  }, [assessmentDetails]);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[index].questionText = value;
    setFormQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optionIndex, value) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[qIndex].options[optionIndex] = value;
    setFormQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions[qIndex].correctAnswer = value;
    setFormQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...formQuestions];
    updatedQuestions.splice(index, 1);
    setFormQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };
    setFormQuestions([...formQuestions, newQuestion]);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const isValid = formQuestions.every((q) =>
      q.questionText.trim() &&
      q.options.every((opt) => opt.trim()) &&
      q.correctAnswer.trim()
    );

    if (!isValid) {
      // alert('Please fill out all questions, options, and select a correct answer.');
      Swal.fire({
        title:'Please fill out all questions, options, and select a correct answer.',
        icon: "question"
      })
      return;
    }

    const formattedQuestions = formQuestions.map((q) => ({
      questionText: q.questionText,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correctOption: q.correctAnswer,
    }));

    const payload = {
      courseId: assessmentDetails.course.courseId,
      questions: formattedQuestions,
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      duration: Number(duration),
    };

    try {
      const response = await updateAssessment(payload);
      console.log('Assessment updated successfully:', response.data);
      Swal.fire("Success!", "Assessment updated successfully!", "success");
      navigate('/courselist');
    } catch (error) {
      console.error('Error updating assessment:', error);
      Swal.fire("Error!", "Failed to update assessment. Please try again.", "error");

    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Assessment</h1>

        {/* Total Marks */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Total Marks</label>
          <input
            type="number"
            onChange={(e) => setTotalMarks(e.target.value)}
            value={totalMarks}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter total marks"
          />
        </div>

        {/* Passing Marks */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Passing Marks</label>
          <input
            type="number"
            onChange={(e) => setPassingMarks(e.target.value)}
            value={passingMarks}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter passing marks"
          />
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">Duration (in minutes)</label>
          <input
            type="number"
            onChange={(e) => setDuration(e.target.value)}
            value={duration}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter duration"
          />
        </div>

        {/* Questions */}
        {formQuestions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Question {qIndex + 1}
            </h3>
            {/* Question Text */}
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the question"
            />
            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-4">
                  <label className="font-medium text-gray-700">Option {optIndex + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter option ${optIndex + 1}`}
                  />
                </div>
              ))}
            </div>
            {/* Correct Answer */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700 mb-2">Correct Answer</label>
              <select
                value={question.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Correct Answer</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {option || `Option ${optIndex + 1}`}
                  </option>
                ))}
              </select>
            </div>
            {/* Remove Button */}
            <button
              onClick={() => handleRemoveQuestion(qIndex)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Remove This Question
            </button>
          </div>
        ))}

        {/* Add New Question Button */}
        <div className="flex justify-center mt-6">
        <button
            onClick={handleAddQuestion}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
            Add New Question
        </button>
        </div>


        {/* Submit Button */}
        <button
          onClick={handleSubmitForm}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Assessment
        </button>
      </div>
    </div>
  );
};

export default UpdateAssessment;
