import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSignUp = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        alert("Incorrect Password");
        return;
      }
  
      try {
        // send the signup request to the backend
        const res = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim().toLowerCase(),
            password: password,
          }),
        });
  
        const data = await res.json();
  
        // successful
        if (res.ok) {
          alert("Account created successfully! You will now be redirected to the sign in page");
          navigate('/signin'); // redirect to signin page 
        } 

        else {
          alert(data.error || "Signup failed");
        }
      } catch (err) {
        console.error("Signup error:", err);
        alert("Server error");
      }
    };
  
    return (
      <div className="page-content">
        <h1>Sign Up</h1>
        <p>Create your account to start using the audio transcription service.</p>
  
        <form onSubmit={handleSignUp} className="auth-form">
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
              placeholder="Create a password"
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
  
          <button type="submit" className="btn btn--primary btn--large">
            Create Account
          </button>
        </form>
  
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <em>For testing: Fill in any information and submit</em>
        </p>
      </div>
    );
  }
  