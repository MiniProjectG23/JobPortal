import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from './mockData';
import './InterviewRecorder.css';

const InterviewRecorder = ({ role, onFinish }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const questionList = questions[role];

  useEffect(() => {
    const init = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = mediaStream;

      const recorder = new MediaRecorder(mediaStream);
      const localChunks = [];

      recorder.ondataavailable = e => localChunks.push(e.data);
      recorder.onstop = async () => {
        clearInterval(timerRef.current);
        const blob = new Blob(localChunks, { type: 'video/webm' });
        const file = new File([blob], 'mock_interview.webm');
        const formData = new FormData();
        formData.append('video', file);

        const res = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        onFinish(data.confidence);
      };

      recorder.start();
      setChunks(localChunks);
      setMediaRecorder(recorder);
      setRecording(true);

      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    };

    init();

    return () => {
      // Clean up stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate, onFinish]);

  const next = () => {
    if (questionIndex + 1 < questionList.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      navigate('/feedback', { state: { role, confidence: 0.8 } });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const stopRecordingHandler = () => {
    if (window.confirm('Are you sure you want to stop recording?')) {
      stop();
      navigate('/feedback', { state: { role, confidence: 0.8 } });
    }
  };

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setRecording(false);
    clearInterval(timerRef.current);
    setTimer(0);

    // Stop all media tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="interview-container">
      <div className="question-section">
        <h3>Question:</h3>
        <p>{questionList[questionIndex]}</p>
        <div className="button-group">
          <button className="next-btn" onClick={next}>
            {questionIndex + 1 < questionList.length ? '➡️ Next Question' : '✅ Submit'}
          </button>
        </div>
      </div>

      <div className="video-section">
        <video ref={videoRef} autoPlay muted width="500" />

        {recording && (
          <div className="stop-timer-wrapper">
            <button className="stop-btn" onClick={stopRecordingHandler}>⏹ Stop Recording</button>
            <div className="timer-display">⏱️ {formatTime(timer)}</div>
          </div>
        )}

        <div className="speech-text">
          <h4>Speech-to-Text:</h4>
          <p>[Your transcribed text here]</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewRecorder;
