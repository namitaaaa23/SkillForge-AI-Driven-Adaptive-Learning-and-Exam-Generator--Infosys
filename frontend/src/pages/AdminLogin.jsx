import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function AdminLogin() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
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
                    role: 'ADMIN'
                });
                
                navigate('/admin-dashboard', { 
                    state: { userProfile: { userName: result.name, email: result.email, role: result.role } } 
                });
            } else {
                const result = await api.login(formData.email, formData.password);
                
                navigate('/admin-dashboard', { 
                    state: { userProfile: { userName: result.name, email: result.email, role: result.role } } 
                });
            }
        } catch (error) {
            if (isSignUp) {
                setErrors({ email: error.message });
            } else {
                setErrors({ password: error.message });
            }
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">Admin</h2>

                {isSignUp && (
                    <input 
                        type="text" 
                        placeholder="Full Name *" 
                        value={formData.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                )}
                
                <input 
                    type="email" 
                    placeholder="Email Address *" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
                
                <div className="password-field">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password *" 
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
                {errors.password && <span className="error-text">{errors.password}</span>}

                {isSignUp && (
                    <>
                        <div className="password-field">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password *" 
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                    {isSignUp ? "Create Administrator Account" : "Administrator Sign In"}
                </button>

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
