import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { userDatabase } from "../utils/userDatabase";

export default function LearnerLogin() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        studentId: '',
        institution: ''
    });
    const [errors, setErrors] = useState({});
    const [resetMessage, setResetMessage] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (isSignUp && !formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.includes('@')) newErrors.email = 'Valid email is required';
        if (formData.email.includes('@admin.') || formData.email.includes('@guardian.')) {
            newErrors.email = 'This email is not authorized for student access';
        }
        
        if (isSignUp) {
            const passwordError = userDatabase.validatePassword(formData.password);
            if (passwordError) newErrors.password = passwordError;
        } else if (formData.password.length < 1) {
            newErrors.password = 'Password is required';
        }
        
        if (isSignUp && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (isSignUp && !formData.institution.trim()) newErrors.institution = 'Institution is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
        
        // Check for existing user when email changes during sign up
        if (field === 'email' && isSignUp && value.includes('@')) {
            if (userDatabase.userExists(value)) {
                setErrors(prev => ({ ...prev, email: 'User already exists. Please sign in instead.' }));
            }
        }
    };

    const handleLogin = () => {
        if (!validateForm()) return;
        
        if (isSignUp) {
            // Register new user
            const newUser = {
                email: formData.email,
                fullName: formData.fullName,
                role: 'learner',
                studentId: formData.studentId,
                institution: formData.institution,
                password: formData.password
            };
            userDatabase.registerUser(newUser);
            const userProfile = {
                userName: newUser.fullName,
                email: newUser.email,
                studentId: newUser.studentId,
                institution: newUser.institution,
                role: 'Student'
            };
            navigate('/learner-dashboard', { state: { userProfile } });
        } else {
            // Sign in existing user
            const user = userDatabase.authenticateUser(formData.email, formData.password);
            if (user) {
                const userProfile = {
                    userName: user.fullName,
                    email: user.email,
                    studentId: user.studentId,
                    institution: user.institution,
                    role: 'Student'
                };
                navigate('/learner-dashboard', { state: { userProfile } });
            } else {
                setErrors({ password: 'Invalid email or password' });
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
                            value={formData.fullName} 
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className={errors.fullName ? 'error' : ''}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
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
                
                {isSignUp && (
                    <>
                        <input 
                            type="text" 
                            placeholder="Student ID" 
                            value={formData.studentId} 
                            onChange={(e) => handleInputChange('studentId', e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Institution *" 
                            value={formData.institution} 
                            onChange={(e) => handleInputChange('institution', e.target.value)}
                            className={errors.institution ? 'error' : ''}
                        />
                        {errors.institution && <span className="error-text">{errors.institution}</span>}
                    </>
                )}
                
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

                <button className="login-btn" onClick={handleLogin}>{isSignUp ? "Sign Up" : "Sign In"}</button>

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
                        Forgot Password?
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
                                    const result = userDatabase.sendPasswordToEmail(formData.email);
                                    setResetMessage(result.message);
                                }}
                            >
                                Send Password
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