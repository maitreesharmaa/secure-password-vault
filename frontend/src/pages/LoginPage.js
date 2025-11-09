import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setToken }) {
    const [username, setUsername] = useState('');
    const [masterPassword, setMasterPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 1. Add this new state
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/bg1.jpg')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        return () => {
            document.body.style.backgroundImage = 'none';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                // --- Registration Logic ---
                await axios.post(`/api/auth/register`, { username, master_password: masterPassword });
                alert('Registration successful! Please log in.');
                setIsRegistering(false); // Switch to login form
            } else {
                // --- Login Logic ---
                const res = await axios.post(`/api/auth/login`, { username, master_password: masterPassword });
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
                navigate('/vault'); // Go to vault on successful login
            }
        } catch (err) {
            console.error(err);
            alert('Operation failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <h2>🔒 {isRegistering ? 'Create Your Vault' : 'Password Vault'} 🔒</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    // 2. Change the type to be dynamic
                    type={showPassword ? "text" : "password"}
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Master Password"
                    required
                />

                {/* 3. Add the checkbox element */}
                <div className="show-password-login">
                    <input 
                        type="checkbox" 
                        id="show-login" 
                        checked={showPassword} 
                        onChange={() => setShowPassword(!showPassword)} 
                    />
                    <label htmlFor="show-login">Show Password</label>
                </div>

                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>
            <button className="toggle-btn" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account?' : 'Need an account?'}
            </button>
        </div>
    );
}

export default LoginPage;