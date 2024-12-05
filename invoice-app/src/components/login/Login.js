import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './login.css'; // Updated import for the CSS file

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            localStorage.setItem('cName', user.displayName);
            localStorage.setItem('photoUrl', user.photoURL);
            localStorage.setItem('email', user.email);
            localStorage.setItem('uid', user.uid);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-boxes login-left"></div>
                <div className="login-boxes login-right">
                    <form onSubmit={submitHandler}>
                        <h2 className="login-heading">Login</h2>
                        {error && <p className="error-message">{error}</p>}
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="login-input" 
                            type="email" 
                            placeholder="Enter Email" 
                            required 
                        />
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="login-input" 
                            type="password" 
                            placeholder="Enter Password" 
                            required 
                        />
                        <input 
                            className="login-input login-btn" 
                            type="submit" 
                            value="Login" 
                        />
                    </form>
                    <Link to="/register" className="register-link">Create an Account</Link>
                </div>
            </div>
        </div>
    );
};
