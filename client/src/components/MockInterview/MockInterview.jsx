import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import Instructions from './Instructions';
import InterviewRecorder from './InterviewRecorder';
import Feedback from './Feedback';
import './MockInterview.css';
const MockInterview = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [score, setScore] = useState(null);

  const next = () => setStep(prev => prev + 1);

  return (
    <div>
    
    <h1 className="text-4xl text-amber-200">Hello Mock Interview</h1>
      {step === 1 && <RoleSelector onSelect={(role) => { setRole(role); next(); }} />}
      {step === 2 && <Instructions role={role} onStart={next} />}
      {step === 3 && <InterviewRecorder role={role} onFinish={(confScore) => { setScore(confScore); next(); }} />}
      {step === 4 && <Feedback role={role} confidence={score} />}
      
    </div>
  );
};

export default MockInterview;