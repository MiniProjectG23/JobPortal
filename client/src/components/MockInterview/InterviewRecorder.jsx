import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from './mockData';
import './InterviewRecorder.css';

const InterviewRecorder = ({ role }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scoreListRef = useRef([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const mediaStreamRef = useRef(null); // ✅ to hold stream persistently

  const questionList = questions[role];

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;

        captureIntervalRef.current = setInterval(captureFrameAndSend, 5000);
        timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
      } catch (err) {
        console.error('Error accessing camera/mic:', err);
      }
    };

    init();

    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    console.log('🧹 Cleaning up resources');

    clearInterval(captureIntervalRef.current);
    clearInterval(timerRef.current);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrameAndSend = async () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, 48, 48);
    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      const res = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await res.json();
      const roundedConfidence = parseFloat(data.confidence.toFixed(4));
      setEmotion(data.emotion);
      setConfidence(roundedConfidence);
      scoreListRef.current.push(roundedConfidence);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  const next = () => {
    if (questionIndex + 1 < questionList.length) {
      setQuestionIndex(prev => prev + 1);
    } else {
      stopAndSubmit();
    }
  };

  const stopAndSubmit = () => {
    cleanupResources();

    const avgConfidence = scoreListRef.current.length
      ? scoreListRef.current.reduce((a, b) => a + b, 0) / scoreListRef.current.length
      : 0.0;

    navigate('/feedback', {
      state: { role, confidence: avgConfidence },
      replace: true,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const stopRecordingHandler = () => {
    if (window.confirm('Are you sure you want to stop recording?')) {
      stopAndSubmit();
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
        <div className="stop-timer-wrapper">
          <button className="stop-btn" onClick={stopRecordingHandler}>⏹ Stop Recording</button>
          <div className="timer-display">⏱️ {formatTime(timer)}</div>
        </div>
        <div className="emotion-output">
          <p><strong>Detected Emotion:</strong> {emotion || 'Detecting...'}</p>
          <p><strong>Confidence:</strong> {confidence !== null ? confidence.toFixed(2) : '...'}</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewRecorder;
