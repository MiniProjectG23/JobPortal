import React, { useState } from 'react';

const roles = ['Frontend Developer', 'Backend Developer', 'HR', 'Data Analyst'];

export default function RoleSelector({ onSelect }) {
  const [selectedRole, setSelectedRole] = useState('');

  const handleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onSelect(selectedRole);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br  bg-white">
      <div className="bg-[linear-gradient(90deg,_#2e034bf8,_#a855f7)] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

        <h2 className="text-2xl font-bold mb-6 text-amber-400 text-center tracking-wide">🎯 Choose Your Role</h2>
        
        <select
          value={selectedRole}
          onChange={handleChange}
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
        >
          <option value="" disabled>Select a role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full py-3 rounded-md font-semibold text-lg transition-all duration-300 
            ${selectedRole ? 'bg-amber-500 hover:bg-amber-600 shadow-md' : 'bg-gray-600 cursor-not-allowed'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
