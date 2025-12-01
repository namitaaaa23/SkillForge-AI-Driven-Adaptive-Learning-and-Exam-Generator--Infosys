import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { userDatabase } from "../utils/userDatabase";

export default function AdminLogin() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email || !formData.password) {
            newErrors.general = 'Please fill in all fields';
        }
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
            if (!formData.fullName) {
                setErrors({ general: 'Please enter your full name' });
                return;
            }
            // Register new user
            const newUser = {
                email: formData.email,
                fullName: formData.fullName,
                role: 'admin',
                adminId: 'ADM' + Date.now().toString().slice(-3),
                department: 'Academic Affairs',
                institution: 'Stanford University',
                password: formData.password
            };
            userDatabase.registerUser(newUser);
            const userProfile = {
                userName: newUser.fullName,
                email: newUser.email,
                adminId: newUser.adminId,
                department: newUser.department,
                institution: newUser.institution,
                accessLevel: 'Full Access'
            };
            navigate('/admin-dashboard', { state: { userProfile } });
        } else {
            // Sign in existing user
            const user = userDatabase.authenticateUser(formData.email, formData.password);
            if (user && user.role === 'admin') {
                const userProfile = {
                    userName: user.fullName,
                    email: user.email,
                    adminId: user.adminId,
                    department: user.department || 'Academic Affairs',
                    institution: user.institution || 'Stanford University',
                    accessLevel: 'Full Access'
                };
                navigate('/admin-dashboard', { state: { userProfile } });
            } else if (user) {
                setErrors({ password: 'This account is not an admin account' });
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
                <h2 className="login-title">Admin</h2>

                {isSignUp && <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />}
                <input type="email" placeholder="Admin Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} onKeyPress={handleKeyPress} className={errors.email ? 'error' : ''} />
                {errors.email && <span className="error-text">{errors.email}</span>}
                
                <div className="password-field">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <span 
                        className="password-toggle" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                
                {isSignUp && (
                    <div className="password-field">
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm Password" 
                        />
                        <span 
                            className="password-toggle" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                )}

                <button className="login-btn" onClick={handleLogin}>{isSignUp ? "Sign Up" : "Sign In"}</button>

                <p className="toggle-text">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <span className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? " Sign In" : " Sign Up"}
                    </span>
                </p>

                <Link to="/" className="back-link">← Back to Home</Link>
            </div>
        </div>
    );
}
