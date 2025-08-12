import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage({ isLoggedIn = false }) {
    const [message, setMessage] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    useEffect(() => {
        fetch("http://localhost:5000/hello")
            .then(res => res.text())
            .then(data => {
                setMessage(data)
                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching from backend:', error)
                setMessage('Failed to connect to backend')
            })
    }, [])

    const handleStartRecording = () => {
        setIsRecording(true)
        // TODO: Implement actual recording logic
        console.log('Recording started')
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        // TODO: Implement actual recording stop logic
        console.log('Recording stopped')
    }

    if (!isLoggedIn) {
        return (
            <div className="page-content">
                <div className="welcome-section">
                    <h1>Welcome to Audio Transcription Assistant</h1>
                    <p>Record your voice and get instant transcriptions with our advanced AI-powered system.</p>
                    
                    <div className="auth-buttons">
                        <Link to="/signup" className="btn btn--primary btn--large">
                            Get Started - Sign Up
                        </Link>
                        <Link to="/signin" className="btn btn--secondary btn--large">
                            Already have an account? Log In
                        </Link>
                    </div>
                </div>
                
                <div className="features-section">
                    <h2>Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>🎤 Voice Recording</h3>
                            <p>High-quality audio capture with noise reduction</p>
                        </div>
                        <div className="feature-card">
                            <h3>🤖 AI Transcription</h3>
                            <p>Accurate speech-to-text conversion</p>
                        </div>
                        <div className="feature-card">
                            <h3>📚 History</h3>
                            <p>Access all your previous transcriptions</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Logged in user view
    return (
        <div className="page-content">
            <div className="recording-section">
                <h1>Audio Recording & Transcription</h1>
                <p>Click the buttons below to start or stop recording your audio.</p>
                
                <div className="recording-controls">
                    <button 
                        onClick={handleStartRecording}
                        disabled={isRecording}
                        className={`btn btn--primary btn--large ${isRecording ? 'btn--disabled' : 'btn--active'}`}
                    >
                        {isRecording ? '🔴 Recording...' : '🎤 Start Recording'}
                    </button>
                    
                    <button 
                        onClick={handleStopRecording}
                        disabled={!isRecording}
                        className={`btn btn--secondary btn--large ${!isRecording ? 'btn--disabled' : ''}`}
                    >
                        ⏹️ Stop Recording
                    </button>
                </div>
                
                {isRecording && (
                    <div className="recording-status">
                        <p className="recording-indicator">🔴 Recording in progress...</p>
                        <p>Speak clearly into your microphone</p>
                    </div>
                )}
            </div>
            
            <div className="backend-message">
                <h2>Message from Backend:</h2>
                {message ? (
                    <p>{message}</p>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )
}