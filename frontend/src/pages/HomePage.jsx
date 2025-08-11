import { useState, useEffect } from 'react'

export default function HomePage() {
    const [message, setMessage] = useState('')

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
    
    //this is the home page
    return (
        <div className="page-content">
            <h1>Record your voice and have a transcript created here</h1>
            
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