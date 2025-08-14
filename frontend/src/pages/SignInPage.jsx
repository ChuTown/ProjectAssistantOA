import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage({ onLogin }) {
    
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault()
        
        try {
            // send the sign in request to the backend
            const res = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    username: username.trim().toLowerCase(),
                    password: password,
                }),
            });

            const data = await res.json();

            // successful login
            if (res.ok) {
                alert("Login Successful! You will now be redirected to the homepage");
                onLogin(); // call the login function to update state
                navigate('/'); // navigate to root path (homepage)
            } else {
                alert(data.error || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Server error");
        }
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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