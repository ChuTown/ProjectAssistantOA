import { useState, useRef } from 'react';
import './TranscriptionComponent.css';

const TranscriptionComponent = ({ isLoggedIn, username, onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Error accessing microphone: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      
      if (isLoggedIn && username) {
        formData.append('username', username);
      }

      const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTranscript(result.text);
      onTranscriptionComplete(); // Call the callback after successful transcription
    } 
    catch (err) {
      setError('Error transcribing audio: ' + err.message);
    } 
    finally {
      setIsTranscribing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError('');
  };

  return (
    <div className="transcription-container">
      <h2>Audio Transcription</h2>
      
      <div className="recording-controls">
        {!isRecording ? (
          <button 
            onClick={startRecording}
            className="record-btn"
            disabled={isTranscribing}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="stop-btn"
          >
            ⏹️ Stop Recording
          </button>
        )}
      </div>

      {isRecording && (
        <div className="recording-indicator">
          🔴 Recording... Speak now!
        </div>
      )}

      {isTranscribing && (
        <div className="transcribing-indicator">
          🔄 Transcribing audio...
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {transcript && (
        <div className="transcript-section">
          <h3>Transcript:</h3>
          <div className="transcript-text">
            {transcript}
          </div>
          <button onClick={clearTranscript} className="clear-btn">
            Clear Transcript
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <div className="login-notice">
          💡 Sign in to save your transcripts
        </div>
      )}
    </div>
  );
};

export default TranscriptionComponent;
