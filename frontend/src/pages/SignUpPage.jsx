export default function SignUpPage({ onLogin }) {
    const handleSignUp = (e) => {
        e.preventDefault()
        // In a real app, you would create the account here
        onLogin()
    }

    return (
        <div className="page-content">
            <h1>Sign Up</h1>
            <p>Create your account to start using the audio transcription service.</p>
            
            <form onSubmit={handleSignUp} className="auth-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        placeholder="Enter your full name"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        placeholder="Create a password"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        required 
                        placeholder="Confirm your password"
                    />
                </div>
                
                <button type="submit" className="btn btn--primary btn--large">
                    Create Account
                </button>
            </form>
            
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                <em>For testing: Fill in any information and submit</em>
            </p>
        </div>
    )
}