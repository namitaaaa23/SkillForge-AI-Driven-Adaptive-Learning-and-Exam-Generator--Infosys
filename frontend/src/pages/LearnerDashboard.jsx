import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./LearnerDashboard.css";

export default function LearnerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: location.state?.userProfile?.userName || "Alex Johnson",
    email: location.state?.userProfile?.email || "alex@school.edu",
    studentId: location.state?.userProfile?.studentId || "STU001",
    institution: location.state?.userProfile?.institution || "Stanford University",
    phone: "",
    dateOfBirth: "",
    major: "",
    year: ""
  });
  const [loading, setLoading] = useState(false);
  
  const userProfile = {
    ...profileData,
    role: "Student"
  };

  const dashboardData = {
    rank: 12,
    totalStudents: 847,
    currentModule: "Advanced Mathematics",
    moduleProgress: 73,
    gpa: 3.85,
    completedCourses: 8,
    activeCourses: courses.length || 4,
    upcomingAssessments: exams.slice(0, 3).map(exam => ({
      name: exam.title,
      date: "Upcoming",
      type: "Exam"
    })),
    recentGrades: [
      { course: "Advanced Mathematics", grade: "A", score: 94 },
      { course: "Applied Physics", grade: "A-", score: 91 },
      { course: "Chemistry Fundamentals", grade: "B+", score: 87 }
    ],
    studyStreak: 15,
    weeklyGoal: 25,
    weeklyProgress: 18
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, examsData] = await Promise.all([
        api.getAllCourses(),
        api.getAllExams()
      ]);
      setCourses(coursesData || []);
      setExams(examsData || []);
      
      // Update profile with current user data
      const currentUser = api.getCurrentUser();
      if (currentUser) {
        setProfileData(prev => ({
          ...prev,
          userName: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please refresh the page.');
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        navigate('/learner-login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ld-wrapper">
      <div className="ld-topbar">
        <div className="header-container">
          <div className="ld-logo">SkillForge AI</div>
          
          <nav className="nav-links">
            <a href="#dashboard" className={activeTab === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>Dashboard</a>
            <a href="/learner-content" onClick={(e) => { e.preventDefault(); navigate('/learner-content', { state: { userProfile } }); }}>Content</a>
            <a href="#progress" className={activeTab === 'progress' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('progress'); }}>Progress</a>
            <a href="#profile" className={activeTab === 'profile' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>Profile</a>
          </nav>
          
          <div className="ld-topbar-right">
            <div 
              className="ld-avatar" 
              onClick={() => setShowMenu(!showMenu)}
            >
              {profileData.userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="ld-menu-panel">
          <div className="ld-user-info">
            <h3>{profileData.userName}</h3>
            <p>{profileData.email}</p>
            <p>ID: {profileData.studentId}</p>
          </div>
          <button className="ld-menu-item" onClick={() => setActiveTab('profile')}>Profile</button>
          <button className="ld-logout" onClick={() => {
            api.logout();
            navigate('/');
          }}>Sign Out</button>
        </div>
      )}

      <div className="ld-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>{profileData.userName}</h1>
            <p>{profileData.institution} • {profileData.studentId}</p>
          </div>
          <div className="header-right">
            <div className="gpa-badge">
              <span className="gpa-label">Rank</span>
              <span className="gpa-value">#{dashboardData.rank}</span>
            </div>
          </div>
        </div>

        <div className="ld-stats-grid">
          <div className="ld-stat-card">
            <h3>Learning Progress</h3>
            <div className="stat-value">{dashboardData.moduleProgress}%</div>
            <p>Current Module</p>
          </div>

          <div className="ld-stat-card">
            <h3>Active Courses</h3>
            <div className="stat-value">{courses.length || dashboardData.activeCourses}</div>
            <p>{dashboardData.completedCourses} Completed</p>
          </div>

          <div className="ld-stat-card">
            <h3>Assessments</h3>
            <div className="stat-value">{exams.length || dashboardData.upcomingAssessments.length}</div>
            <p>Available</p>
          </div>

          <div className="ld-stat-card">
            <h3>Study Streak</h3>
            <div className="stat-value">{dashboardData.studyStreak}</div>
            <p>Days Consistent</p>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="ld-section">
              <h2>Current Learning Path</h2>
              <div className="ld-progress-card">
                <div className="progress-header">
                  <div>
                    <h3>{dashboardData.currentModule}</h3>
                    <p>Module 7: Advanced Problem Solving</p>
                  </div>
                  <span className="progress-percent">{dashboardData.moduleProgress}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${dashboardData.moduleProgress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="ld-section">
              <h2>Available Assessments</h2>
              <div className="assessment-list">
                {exams.length > 0 ? (
                  exams.map((exam) => (
                    <div key={exam.id} className="assessment-item">
                      <div className="assessment-info">
                        <h4>{exam.title}</h4>
                        <span className="assessment-meta">Duration: {exam.duration} minutes • Total Points: {exam.totalMarks}</span>
                      </div>
                      <button className="assessment-status" onClick={async () => {
                        if (!confirm(`Are you ready to start ${exam.title}?\n\nDuration: ${exam.duration} minutes\nTotal Points: ${exam.totalMarks}\n\nOnce started, the timer cannot be paused.`)) return;
                        
                        setLoading(true);
                        try {
                          // Simulate exam start
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          alert(`${exam.title} started successfully!\n\nTimer: ${exam.duration} minutes\nGood luck with your assessment!`);
                        } catch (error) {
                          alert('Failed to start exam. Please try again.');
                        } finally {
                          setLoading(false);
                        }
                      }} disabled={loading}>Start Assessment</button>
                    </div>
                  ))
                ) : (
                  dashboardData.upcomingAssessments.map((assessment, index) => (
                    <div key={index} className="assessment-item">
                      <div className="assessment-info">
                        <h4>{assessment.name}</h4>
                        <span className="assessment-meta">{assessment.type} • {assessment.date}</span>
                      </div>
                      <button className="assessment-status" onClick={() => alert(`${assessment.name} - ${assessment.type}\nScheduled for: ${assessment.date}\nPrepare well!`)}>View Schedule</button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="ld-section">
              <h2>Available Courses</h2>
              <div className="assessment-list">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <div key={course.id} className="assessment-item">
                      <div className="assessment-info">
                        <h4>{course.title}</h4>
                        <span className="assessment-meta">{course.description || 'No description'}</span>
                      </div>
                      <button className="assessment-status" onClick={async () => {
                        if (!confirm(`Enroll in ${course.title}?\n\n${course.description || 'Professional course curriculum'}\n\nThis will add the course to your dashboard.`)) return;
                        
                        setLoading(true);
                        try {
                          // Simulate enrollment
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          alert(`Successfully enrolled in ${course.title}!\n\nAccess your course materials in the Content section.\nYou will receive email confirmation shortly.`);
                        } catch (error) {
                          alert('Enrollment failed. Please try again or contact support.');
                        } finally {
                          setLoading(false);
                        }
                      }} disabled={loading}>Enroll Now</button>
                    </div>
                  ))
                ) : (
                  <p>No courses currently available. Please check back later.</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'progress' && (
          <>
            <div className="ld-section">
              <h2>Learning Progress Trend</h2>
              <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', height: '300px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#667eea"/>
                      <stop offset="100%" stopColor="#764ba2"/>
                    </linearGradient>
                    <linearGradient id="progressArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(102, 126, 234, 0.3)"/>
                      <stop offset="100%" stopColor="rgba(102, 126, 234, 0)"/>
                    </linearGradient>
                  </defs>
                  <polyline points="0,180 133,165 266,150 400,135 533,115 666,95 800,70" fill="none" stroke="url(#progressGrad)" strokeWidth="3"/>
                  <polygon points="0,250 0,180 133,165 266,150 400,135 533,115 666,95 800,70 800,250" fill="url(#progressArea)"/>
                </svg>
                <div style={{ position: 'absolute', bottom: '8px', left: '32px', right: '32px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>
                  <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span><span>Week 6</span>
                </div>
              </div>
            </div>

            <div className="ld-section">
              <h2>Course Progress</h2>
              <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>Advanced Calculus</span>
                    <span style={{ fontWeight: '700', color: '#667eea' }}>73%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '73%', height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '6px' }}></div>
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>Physics II</span>
                    <span style={{ fontWeight: '700', color: '#667eea' }}>91%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '91%', height: '100%', background: 'linear-gradient(90deg, #43e97b, #38f9d7)', borderRadius: '6px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#2d3748' }}>Organic Chemistry</span>
                    <span style={{ fontWeight: '700', color: '#667eea' }}>54%</span>
                  </div>
                  <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: '54%', height: '100%', background: 'linear-gradient(90deg, #fa709a, #fee140)', borderRadius: '6px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ld-section">
              <h2>Learning Milestones</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Completed 8 Courses</h4>
                    <span className="assessment-meta">Achievement unlocked • December 2024</span>
                  </div>
                  <span className="assessment-status">🏆</span>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>15 Day Study Streak</h4>
                    <span className="assessment-meta">Keep it up! • Current streak</span>
                  </div>
                  <span className="assessment-status">🔥</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="ld-section">
              <h2>Performance Analytics</h2>
              <div className="performance-grid">
                {dashboardData.recentGrades.map((grade, index) => (
                  <div key={index} className="performance-item">
                    <div className="performance-course">{grade.course}</div>
                    <div className="performance-score">
                      <span className="score-value">{grade.score}%</span>
                      <span className="score-grade">{grade.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <div className="ld-section">
              <h2>Profile Information</h2>
              {!isEditingProfile ? (
                <div className="assessment-list">
                  <div className="assessment-item">
                    <div className="assessment-info">
                      <h4>Personal Details</h4>
                      <span className="assessment-meta">
                        Name: {profileData.userName}<br/>
                        Email: {profileData.email}<br/>
                        {profileData.phone && `Phone: ${profileData.phone}`}<br/>
                        {profileData.dateOfBirth && `DOB: ${profileData.dateOfBirth}`}
                      </span>
                    </div>
                    <button className="assessment-status" onClick={() => setIsEditingProfile(true)}>Edit</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.userName}
                      onChange={(e) => setProfileData({...profileData, userName: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Phone</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Date of Birth</label>
                    <input 
                      type="date" 
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={async () => {
                        setLoading(true);
                        try {
                          // Simulate profile save
                          await new Promise(resolve => setTimeout(resolve, 800));
                          alert('Profile updated successfully!');
                          setIsEditingProfile(false);
                        } catch (error) {
                          alert('Failed to update profile. Please try again.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="ld-section">
              <h2>Academic Information</h2>
              {!isEditingAcademic ? (
                <div className="assessment-list">
                  <div className="assessment-item">
                    <div className="assessment-info">
                      <h4>Academic Details</h4>
                      <span className="assessment-meta">
                        Institution: {profileData.institution}<br/>
                        Student ID: {profileData.studentId}<br/>
                        {profileData.major && `Major: ${profileData.major}`}<br/>
                        {profileData.year && `Year: ${profileData.year}`}
                      </span>
                    </div>
                    <button className="assessment-status" onClick={() => setIsEditingAcademic(true)}>Edit</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Institution</label>
                    <input 
                      type="text" 
                      value={profileData.institution}
                      onChange={(e) => setProfileData({...profileData, institution: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Student ID</label>
                    <input 
                      type="text" 
                      value={profileData.studentId}
                      onChange={(e) => setProfileData({...profileData, studentId: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Major</label>
                    <input 
                      type="text" 
                      value={profileData.major}
                      onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2d3748' }}>Year</label>
                    <select 
                      value={profileData.year}
                      onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                    >
                      <option value="">Select Year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => setIsEditingAcademic(false)}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditingAcademic(false)}
                      style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="ld-section">
              <h2>Account Settings</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Change Password</h4>
                    <span className="assessment-meta">Update your account password for security</span>
                  </div>
                  <button className="assessment-status" onClick={async () => {
                    const newPassword = prompt('Enter new password (minimum 6 characters):');
                    if (!newPassword) return;
                    if (newPassword.length < 6) {
                      alert('Password must be at least 6 characters long.');
                      return;
                    }
                    
                    setLoading(true);
                    try {
                      // Simulate password change
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      alert('Password changed successfully!\n\nYou will be logged out for security. Please log in with your new password.');
                    } catch (error) {
                      alert('Failed to change password. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  }} disabled={loading}>Change</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Email Preferences</h4>
                    <span className="assessment-meta">Manage notification and email settings</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const emailNotifications = confirm('Enable email notifications?');
                    alert(emailNotifications ? 'Email notifications enabled!' : 'Email notifications disabled!');
                  }}>Manage</button>
                </div>
              </div>
            </div>

            <div className="ld-section">
              <h2>Learning Preferences</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Study Reminders</h4>
                    <span className="assessment-meta">Set up daily study reminders and goals</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const reminderTime = prompt('Set daily reminder time (e.g., 9:00 AM):');
                    if (reminderTime) alert(`Study reminder set for ${reminderTime} daily!`);
                  }}>Configure</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Content Format Preference</h4>
                    <span className="assessment-meta">Choose preferred learning formats (Video, PDF, Quiz)</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const format = prompt('Preferred format: Video, PDF, or Quiz?');
                    if (format) alert(`Content preference set to ${format}!`);
                  }}>Set</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>AI Difficulty Level</h4>
                    <span className="assessment-meta">Adjust adaptive quiz difficulty settings</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const difficulty = prompt('Set difficulty: Easy, Medium, or Hard?');
                    if (difficulty) alert(`AI difficulty set to ${difficulty}!`);
                  }}>Adjust</button>
                </div>
              </div>
            </div>

            <div className="ld-section">
              <h2>Privacy & Security</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Two-Factor Authentication</h4>
                    <span className="assessment-meta">Add an extra layer of security to your account</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const phone = prompt('Enter phone number for 2FA:');
                    if (phone) alert('2FA enabled! Verification code sent to ' + phone);
                  }}>Enable</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Privacy Settings</h4>
                    <span className="assessment-meta">Control who can see your progress and achievements</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const isPublic = confirm('Make your progress public?');
                    alert(isPublic ? 'Profile set to public!' : 'Profile set to private!');
                  }}>Manage</button>
                </div>
              </div>
            </div>
          </>
        )}


      </div>

      <div className="ld-ai-assistant" onClick={() => {
        const question = prompt('Ask AI Assistant anything about your studies:');
        if (question) {
          alert(`AI: Based on your progress, here's my suggestion for "${question}": Focus on practice problems and review your weak areas. Keep up the great work!`);
        }
      }} style={{ cursor: 'pointer' }}>
        <div className="ld-ai-icon">AI</div>
      </div>
    </div>
  );
}
