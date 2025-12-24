import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function LearnerLogin() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [resetMessage, setResetMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleLogin = async () => {
        try {
            if (isSignUp) {
                if (formData.password !== formData.confirmPassword) {
                    setErrors({ confirmPassword: 'Passwords do not match' });
                    return;
                }
                const result = await api.register({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    role: 'STUDENT'
                });
                
                const userProfile = {
                    userName: result.name,
                    email: result.email,
                    role: result.role,
                    id: result.id
                };
                navigate('/learner-dashboard', { state: { userProfile } });
            } else {
                const result = await api.login(formData.email, formData.password);
                
                const userProfile = {
                    userName: result.name,
                    email: result.email,
                    role: result.role,
                    id: result.id
                };
                navigate('/learner-dashboard', { state: { userProfile } });
            }
        } catch (error) {
            if (isSignUp) {
                setErrors({ email: error.message });
            } else {
                setErrors({ password: error.message });
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card" onKeyPress={handleKeyPress}>
                <h2 className="login-title">Learner</h2>

                {isSignUp && (
                    <>
                        <input 
                            type="text" 
                            placeholder="Full Name *" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </>
                )}
                
                <input 
                    type="email" 
                    placeholder="Email Address *" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
                

                
                <div className="password-field">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password *" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={errors.password ? 'error' : ''}
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
                
                {isSignUp && (
                    <>
                        <div className="password-field">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password *" 
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            <span 
                                className="password-toggle" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </span>
                        </div>
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </>
                )}

                <button className="login-btn" onClick={handleLogin} disabled={!formData.email || !formData.password || (isSignUp && !formData.name)}>
                    {isSignUp ? "Create Account" : "Sign In"}
                </button>

                <p className="toggle-text">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <span className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? " Sign In" : " Sign Up"}
                    </span>
                </p>

                {!isSignUp && (
                    <span 
                        className="forgot-password-link" 
                        onClick={() => setShowForgotPassword(true)}
                    >
                        Reset Password
                    </span>
                )}
                
                <Link to="/" className="back-link">← Back to Home</Link>
                
                {showForgotPassword && (
                    <div className="forgot-password-modal">
                        <div className="modal-content">
                            <h3>Forgot Password</h3>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                            <button 
                                onClick={() => {
                                    setResetMessage('Password reset link sent to your email!');
                                }}
                            >
                                Send Reset Link
                            </button>
                            <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
                            {resetMessage && <p className="reset-message">{resetMessage}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
