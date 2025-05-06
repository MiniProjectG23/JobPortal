// export default function Instructions({ role, onStart }) {
//   const sendToModel = async (features) => {
//     try {
//       const res = await fetch('http://localhost:5001/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ features }),
//       });
//       const data = await res.json();
//       console.log('Confidence Score:', data.confidence_score);
//       return data.confidence_score;
//     } catch (error) {
//       console.error('Prediction error:', error);
//       return null;
//     }
//   };
  
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white text-white px-12 py-12">
//       <div className="bg-[linear-gradient(90deg,_#2e034bf8,_#a855f7)] backdrop-blur-md p-12 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in">
//         <h2 className="text-3xl font-bold mb-8 text-amber-400 text-center">
//           Mock Interview: {role}
//         </h2>

//         <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-black font-medium">
//           <li className="bg-white bg-opacity-10 p-6 rounded-xl text-center border border-white border-opacity-20 shadow-sm hover:shadow-md transition">
//             Maintain Eye Contact
//           </li>
//           <li className="bg-white bg-opacity-10 p-6 rounded-xl text-center border border-white border-opacity-20 shadow-sm hover:shadow-md transition">
//             Speak Clearly
//           </li>
//           <li className="bg-white bg-opacity-10 p-6 rounded-xl text-center border border-white border-opacity-20 shadow-sm hover:shadow-md transition">
//             Click <span className="text-amber-300 font-semibold" >"Start"</span> when ready
//           </li>
//         </ul>

//         <div className="mt-12 text-center">
//           <button
//             onClick={onStart}
//             className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 shadow-lg"
//           >
//             Start Interview
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


export default function Instructions({ role, onStart }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-purple-800 to-indigo-500 px-6 py-12 font-[Orbitron]">
<div className="w-full max-w-4xl bg-white/20 border-2 border-red-500 backdrop-blur-md rounded-3xl shadow-[0_0_60px_#9b59b620] p-12 md:p-16 text-purple-100 min-h-[45vh] flex flex-col items-center justify-center animate-fade-in">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-6xl text-black font-extrabold drop-shadow-2xl">
             Start Mock Interview
          </h2>
          
          <p className="text-lg tracking-wide mt-24 text-black">
  Candidate Role: <span className="font-bold text-red-400 animate-bounce">{role}</span>
</p>

        </div>

        {/* Instructions List */}
        <div className="grid gap-8 mt-8 sm:grid-cols-2 md:grid-cols-3 text-black">
  {[
    "💡 Be Confident & Calm",
    "👁 Maintain Eye Contact",
    "🗣 Speak Clearly",
    "🧠 Give Answers in a Single Flow",
    "😄 Smile Naturally",
    "✅ Click 'Start' to Launch",
  ].map((tip, i) => (
    <div
      key={i}
      className="bg-white/70 hover:bg-white p-6 rounded-xl text-center text-base font-medium text-black border border-red-400 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#ff4d4d50] cursor-pointer"
    >
      {tip}
    </div>
  ))}
</div>


        {/* Start Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onStart}
            className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white px-12 py-5 rounded-full shadow-lg hover:shadow-[0_0_30px_#9b59b6aa] transition-all duration-300 text-lg font-semibold tracking-wide border border-white/10 hover:scale-105"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}