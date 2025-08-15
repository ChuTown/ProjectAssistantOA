import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TranscriptionComponent from '../components/TranscriptionComponent'
import TranscriptionsHistory from '../components/TranscriptionsHistory'

export default function HomePage({ isLoggedIn = false, onLogout, username }) {
    const [refreshHistory, setRefreshHistory] = useState(0);

    useEffect(() => {
        fetch("http://localhost:5000/")
            .then(res => res.text())
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching from backend:', error)
            })
    }, [])

    const handleTranscriptionComplete = () => {
        setRefreshHistory(prev => prev + 1);
    };

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
                
            </div>
        )
    }
    else {
        return (
            <div className="page-content">
                <div className="logged-in-header">
                    <h1>Welcome back!</h1>
                    <p>Ready to transcribe some audio? Click the button below to start recording.</p>
                    <button onClick={onLogout} className="btn btn--secondary">
                        Log Out
                    </button>
                </div>
                
                <TranscriptionComponent 
                    isLoggedIn={isLoggedIn} 
                    username={username}
                    onTranscriptionComplete={handleTranscriptionComplete}
                />

                <TranscriptionsHistory username={username} refreshKey={refreshHistory} />
            </div>
        )
    }
    
}