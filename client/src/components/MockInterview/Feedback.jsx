import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Feedback() {
  const location = useLocation();
  const { role, confidence } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-lg w-full bg-teal-500 p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Interview Completed</h2>
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-700">
            <strong>Role:</strong> {role}
          </p>
          <p className="text-lg font-medium text-gray-700">
            <strong>Confidence Score:</strong> {confidence}
          </p>
          <div className="text-center">
            {confidence > 0.75 ? (
              <p className="text-green-600 text-xl font-semibold">✅ Great confidence! Keep practicing!</p>
            ) : (
              <p className="text-yellow-600 text-xl font-semibold">⚠️ Try maintaining better eye contact and tone next time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
