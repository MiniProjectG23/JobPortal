import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Feedback() {
  const location = useLocation();
  const { role, confidence, evaluations = [] } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-teal-700 mb-6">🎓 Interview Summary</h2>

        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-800"><strong>Role:</strong> {role}</p>
          <p className="text-lg text-gray-800">
            <strong>Average Confidence Score:</strong> {confidence.toFixed(2)}
          </p>
          <div className="text-center mt-2">
            {confidence > 0.75 ? (
              <p className="text-green-600 font-semibold">✅ Great confidence! Keep practicing!</p>
            ) : (
              <p className="text-yellow-600 font-semibold">⚠️ Try maintaining better eye contact and tone next time.</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {evaluations.length > 0 ? (
            evaluations.map((item, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded-lg bg-gray-100">
                <h4 className="text-md font-semibold text-teal-600 mb-2">Question {index + 1}</h4>
                <p><strong>Q:</strong> {item.question}</p>
                <p><strong>Your Answer:</strong> {item.answer}</p>
                <p><strong>Score:</strong> {item.score}</p>
                <p><strong>Gemini Feedback:</strong> {item.explanation}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No evaluation data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
