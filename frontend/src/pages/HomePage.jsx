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
                
            </div>
        )
    }
    else {
        // keep simple for now
        return (
            <h1>You are logged in, in the homepage</h1>
        )
    }
    
}