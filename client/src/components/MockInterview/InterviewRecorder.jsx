import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InterviewRecorder.css';

const InterviewRecorder = ({ role }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scoreListRef = useRef([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [emotion, setEmotion] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [timer, setTimer] = useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState([]);
  const timerRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);

  useEffect(() => {
    console.log('[Init] Setting up speech recognition');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("⚠️ Speech Recognition not supported in this browser. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('[Speech] Recognition started');
      recognitionActiveRef.current = true;
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      console.log('[Speech] Result received:', speechText);
      setTranscript(speechText);
      evaluateAnswer(questionList[questionIndex], speechText);
    };

    recognition.onerror = (event) => {
      console.error('[Speech] Error:', event.error);
      if (event.error === 'no-speech') {
        setIsRecording(false);
        recognitionActiveRef.current = false;
      }
    };

    recognition.onend = () => {
      console.log('[Speech] Recognition ended');
      recognitionActiveRef.current = false;
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [questionIndex, questionList]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log('[Fetch] Getting questions for role:', role);
        const res = await fetch('http://localhost:5001/get_questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
        const data = await res.json();
        console.log('[Fetch] Questions received:', data.questions);
        setQuestionList(data.questions || []);
      } catch (error) {
        console.error('[Fetch] Error fetching questions:', error);
      }
    };

    const initMedia = async () => {
      try {
        console.log('[Media] Requesting camera and microphone');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;

        clearInterval(captureIntervalRef.current);
        clearInterval(timerRef.current);

        captureIntervalRef.current = setInterval(captureFrameAndSend, 5000);
        timerRef.current = setInterval(() => {
          setTimer(prev => prev + 1);
        }, 1000);

        console.log('[Media] Camera and microphone initialized');
      } catch (err) {
        console.error('[Media] Error accessing media devices:', err);
      }
    };

    fetchQuestions();
    initMedia();

    return () => {
      console.log('[Cleanup] Component unmounting');
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    console.log('[Cleanup] Releasing media and intervals');

    clearInterval(captureIntervalRef.current);
    clearInterval(timerRef.current);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      console.log('[Cleanup] Stopped all media tracks');
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (recognitionRef.current && recognitionActiveRef.current) {
      console.log('[Cleanup] Stopping speech recognition');
      recognitionRef.current.stop();
    }

    recognitionActiveRef.current = false;
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
      console.log('[Frame] Capturing and sending frame for prediction');
      const res = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await res.json();
      const roundedConfidence = parseFloat(data.confidence.toFixed(4));
      console.log('[Frame] Prediction received:', data);

      setEmotion(data.emotion);
      setConfidence(roundedConfidence);
      scoreListRef.current.push(roundedConfidence);
    } catch (error) {
      console.error('[Frame] Error during prediction:', error);
    }
  };

  const startSpeechRecognition = () => {
    if (recognitionRef.current && !recognitionActiveRef.current) {
      console.log('[Speech] Starting speech recognition manually');
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
    } else {
      console.log('[Speech] Already recording or not initialized');
    }
  };

  const evaluateAnswer = async (question, answer) => {
    console.log('[Evaluate] Evaluating answer for:', question);
    try {
      const res = await fetch('http://localhost:5001/evaluate_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();
      console.log('[Evaluate] Response:', data);

      setEvaluationResults(prev => [
        ...prev,
        {
          question,
          answer,
          score: data.score,
          explanation: data.explanation,
        }
      ]);
    } catch (error) {
      console.error('[Evaluate] Error:', error);
    }
  };

  const next = () => {
    if (questionIndex + 1 < questionList.length) {
      console.log('[Navigation] Moving to next question');
      setQuestionIndex(prev => prev + 1);
    } else {
      console.log('[Navigation] All questions answered. Submitting...');
      stopAndSubmit();
    }
  };

  const stopAndSubmit = () => {
    console.log('[Submit] Finalizing and navigating to feedback');
    cleanupResources();

    const avgConfidence = scoreListRef.current.length
      ? scoreListRef.current.reduce((a, b) => a + b, 0) / scoreListRef.current.length
      : 0.0;

    navigate('/feedback', {
      state: {
        role,
        confidence: avgConfidence,
        evaluations: evaluationResults
      },
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
        {questionList.length > 0 ? (
          <p>{questionList[questionIndex]}</p>
        ) : (
          <p>Loading questions...</p>
        )}
        <div className="button-group">
          <button className="record-btn" onClick={startSpeechRecognition} disabled={isRecording}>
            🎤 {isRecording ? 'Recording...' : 'Answer'}
          </button>
          <button className="next-btn" onClick={next}>
            {questionIndex + 1 < questionList.length ? '➡️ Next Question' : '✅ Submit'}
          </button>
        </div>
        {transcript && (
          <p><strong>Your Answer:</strong> {transcript}</p>
        )}
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