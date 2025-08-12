export default function SignedInPage({ onLogin }) {
    const handleLogin = (e) => {
        e.preventDefault()
        // In a real app, you would validate credentials here
        onLogin()
    }

    return (
        <div className="page-content">
            <h1>Sign In</h1>
            <p>Please sign in to access the recording features.</p>
            
            <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        required 
                        placeholder="Enter your username"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        placeholder="Enter your password"
                    />
                </div>
                
                <button type="submit" className="btn btn--primary btn--large">
                    Sign In
                </button>
            </form>
            
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                <em>For testing: Use any username/password combination</em>
            </p>
        </div>
    )
}