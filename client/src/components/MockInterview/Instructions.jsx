export default function Instructions({ role, onStart }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-white px-12 py-12">
      <div className="bg-[linear-gradient(90deg,_#2e034bf8,_#a855f7)] backdrop-blur-md p-12 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-8 text-amber-400 text-center">
          Mock Interview: {role}
        </h2>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-black font-medium">
          <li className="bg-white bg-opacity-10 p-6 rounded-xl text-center border border-white border-opacity-20 shadow-sm hover:shadow-md transition">
            Maintain Eye Contact
          </li>
          <li className="bg-white bg-opacity-10 p-6 rounded-xl text-center border border-white border-opacity-20 shadow-sm hover:shadow-md transition">
            Speak Clearly
          </li>
          <li className="bg-white bg-opacity-10 p-6 rounded-xl text-center border border-white border-opacity-20 shadow-sm hover:shadow-md transition">
            Click <span className="text-amber-300 font-semibold">"Start"</span> when ready
          </li>
        </ul>

        <div className="mt-12 text-center">
          <button
            onClick={onStart}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 shadow-lg"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
