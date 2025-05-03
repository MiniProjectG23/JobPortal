// import React, { useState } from 'react';

// const roles = ['Frontend Developer', 'Backend Developer', 'HR', 'Data Analyst'];

// export default function RoleSelector({ onSelect }) {
//   const [selectedRole, setSelectedRole] = useState('');

//   const handleChange = (e) => {
//     setSelectedRole(e.target.value);
//   };

//   const handleContinue = () => {
//     if (selectedRole) {
//       onSelect(selectedRole);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br  bg-white">
//       <div className="bg-[linear-gradient(90deg,_#2e034bf8,_#a855f7)] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

//         <h2 className="text-2xl font-bold mb-6 text-amber-400 text-center tracking-wide">🎯 Choose Your Role</h2>
        
//         <select
//           value={selectedRole}
//           onChange={handleChange}
//           className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
//         >
//           <option value="" disabled>Select a role</option>
//           {roles.map((role) => (
//             <option key={role} value={role}>
//               {role}
//             </option>
//           ))}
//         </select>

//         <button
//           onClick={handleContinue}
//           disabled={!selectedRole}
//           className={`w-full py-3 rounded-md font-semibold text-lg transition-all duration-300 
//             ${selectedRole ? 'bg-amber-500 hover:bg-amber-600 shadow-md' : 'bg-gray-600 cursor-not-allowed'}`}
//         >
//           Continue
//         </button>
//       </div>
//     </div>
//   );
// }


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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4">
      <div className="flex bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-7xl text-gray-800 overflow-hidden">
        
        {/* Left side with image */}
        <div className="flex-1 hidden md:flex justify-center items-center">
          <img
            src="https://i.pinimg.com/736x/b4/9b/78/b49b787bb3449afbe0f992ac531db2d0.jpg"
            alt="Role Illustration"
            className="rounded-3xl shadow-xl object-cover h-[500px] w-full"
          />
        </div>

        {/* Right side with role selection */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="space-y-10 text-center w-full max-w-sm">
            <h2 className=" font-bold text-white drop-shadow-md">
              Your Role
            </h2>

            <select
              value={selectedRole}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 text-white font-medium backdrop-blur-md border border-white/30 shadow-md focus:outline-none focus:ring-2 focus:ring-white transition-all"
            >
              <option value="" disabled>Select a role</option>
              {roles.map((role) => (
                <option key={role} value={role} className="text-black">
                  {role}
                </option>
              ))}
            </select>

            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl ${
                selectedRole
                  ? 'bg-amber-400 hover:bg-amber-500 text-white'
                  : 'bg-gray-300 cursor-not-allowed text-gray-600'
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}