import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./LearnerDashboard.css";

export default function GuardianDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const userProfile = location.state?.userProfile || {
    userName: "Sarah Johnson",
    email: "guardian@example.com",
    guardianId: "GRD001",
    relationship: "Parent"
  };

  const ward = {
    name: "Alex Johnson",
    studentId: "STU001",
    grade: "Grade 10",
    institution: "Stanford University",
    progress: 73,
    gpa: 3.85,
    rank: 12,
    activeCourses: 4,
    completedCourses: 8,
    studyStreak: 15,
    recentGrades: [
      { course: "Advanced Mathematics", grade: "A", score: 94 },
      { course: "Applied Physics", grade: "A-", score: 91 },
      { course: "Chemistry Fundamentals", grade: "B+", score: 87 }
    ],
    upcomingAssessments: [
      { name: "Mathematics Final Assessment", date: "Dec 15", type: "Examination" },
      { name: "Physics Laboratory Report", date: "Dec 18", type: "Assignment" }
    ]
  };

  return (
    <div className="ld-wrapper">
      <div className="ld-topbar">
        <div className="header-container">
          <div className="ld-logo">SkillForge AI</div>
          
          <nav className="nav-links">
            <a href="#overview" className={activeTab === 'overview' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}>Overview</a>
            <a href="#performance" className={activeTab === 'performance' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('performance'); }}>Performance</a>
            <a href="#attendance" className={activeTab === 'attendance' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('attendance'); }}>Attendance</a>
            <a href="#messages" className={activeTab === 'messages' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('messages'); }}>Messages</a>
            <a href="#profile" className={activeTab === 'profile' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>Profile</a>
          </nav>
          
          <div className="ld-topbar-right">
            <div className="ld-avatar" onClick={() => setShowMenu(!showMenu)}>
              {userProfile.userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="ld-menu-panel">
          <div className="ld-user-info">
            <h3>{userProfile.userName}</h3>
            <p>{userProfile.email}</p>
          </div>
          <button className="ld-menu-item" onClick={() => setActiveTab('profile')}>Profile</button>
          <a href="/" className="ld-logout" onClick={() => { api.logout(); navigate('/'); }}>Sign Out</a>
        </div>
      )}

      <div className="ld-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>{ward.name}'s Progress</h1>
            <p>{ward.institution} • {ward.studentId}</p>
          </div>
          <div className="header-right">
            <div className="gpa-badge">
              <span className="gpa-label">GPA</span>
              <span className="gpa-value">{ward.gpa}</span>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="ld-stats-grid">
              <div className="ld-stat-card">
                <h3>Class Rank</h3>
                <div className="stat-value">#{ward.rank}</div>
                <p>Top 2% of Class</p>
              </div>

              <div className="ld-stat-card">
                <h3>Active Courses</h3>
                <div className="stat-value">{ward.activeCourses}</div>
                <p>{ward.completedCourses} Completed</p>
              </div>

              <div className="ld-stat-card">
                <h3>Study Streak</h3>
                <div className="stat-value">{ward.studyStreak}</div>
                <p>Days Consistent</p>
              </div>

              <div className="ld-stat-card">
                <h3>Overall Progress</h3>
                <div className="stat-value">{ward.progress}%</div>
                <p>Current Semester</p>
              </div>
            </div>

            <div className="ld-section">
              <h2>Recent Performance</h2>
              <div className="performance-grid">
                {ward.recentGrades.map((grade, index) => (
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

            <div className="ld-section">
              <h2>Upcoming Assessments</h2>
              <div className="assessment-list">
                {ward.upcomingAssessments.map((assessment, index) => (
                  <div key={index} className="assessment-item">
                    <div className="assessment-info">
                      <h4>{assessment.name}</h4>
                      <span className="assessment-meta">{assessment.type} • {assessment.date}</span>
                    </div>
                  <button className="assessment-status" onClick={async () => {
                    const assessment = ward.upcomingAssessments[index];
                    setLoading(true);
                    try {
                      await new Promise(resolve => setTimeout(resolve, 800));
                      alert(`${assessment.name}\n\nType: ${assessment.type}\nDate: ${assessment.date}\nStatus: Scheduled\n\nPreparation Tips:\n• Review course materials\n• Practice similar problems\n• Get adequate rest before exam`);
                    } catch (error) {
                      alert('Failed to load assessment details.');
                    } finally {
                      setLoading(false);
                    }
                  }} disabled={loading}>{loading ? 'Loading...' : 'View Details'}</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'performance' && (
          <>
            <div className="ld-stats-grid">
              <div className="ld-stat-card">
                <h3>Average Score</h3>
                <div className="stat-value">91%</div>
                <p>All Subjects</p>
              </div>
              <div className="ld-stat-card">
                <h3>Improvement</h3>
                <div className="stat-value">+8%</div>
                <p>This Semester</p>
              </div>
              <div className="ld-stat-card">
                <h3>Strengths</h3>
                <div className="stat-value">3</div>
                <p>Top Subjects</p>
              </div>
              <div className="ld-stat-card">
                <h3>Focus Areas</h3>
                <div className="stat-value">1</div>
                <p>Needs Attention</p>
              </div>
            </div>

            <div className="ld-section">
              <h2>Subject Performance</h2>
              <div className="performance-grid">
                {ward.recentGrades.map((grade, index) => (
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

            <div className="ld-section">
              <h2>Learning Insights</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Strong in Mathematics</h4>
                    <span className="assessment-meta">Consistently excellent performance • 94% average score</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Academic Strength Analysis\n\n• Consistent high performance in mathematical concepts\n• Strong analytical and problem-solving skills\n• Recommended for advanced placement programs')}>View Analysis</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Improving in Physics</h4>
                    <span className="assessment-meta">12% performance improvement • Current score: 91%</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Progress Tracking Report\n\n• 12% improvement over semester\n• Consistent upward trend\n• Meeting all learning objectives\n• Recommended: Continue current study approach')}>View Progress</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'attendance' && (
          <>
            <div className="ld-stats-grid">
              <div className="ld-stat-card">
                <h3>Attendance Rate</h3>
                <div className="stat-value">96%</div>
                <p>This Semester</p>
              </div>
              <div className="ld-stat-card">
                <h3>Present Days</h3>
                <div className="stat-value">87</div>
                <p>Out of 90</p>
              </div>
              <div className="ld-stat-card">
                <h3>Absent Days</h3>
                <div className="stat-value">3</div>
                <p>Excused</p>
              </div>
              <div className="ld-stat-card">
                <h3>Punctuality</h3>
                <div className="stat-value">98%</div>
                <p>On Time</p>
              </div>
            </div>

            <div className="ld-section">
              <h2>Recent Attendance</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>December 10, 2024</h4>
                    <span className="assessment-meta">All classes attended • On time</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Attendance Record - December 10, 2024\n\n• All classes attended: ✓\n• Arrival time: On schedule\n• Participation: Active\n• Notes: Excellent engagement')}>View Record</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>December 9, 2024</h4>
                    <span className="assessment-meta">All classes attended • On time</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Attendance Record - December 9, 2024\n\n• All classes attended: ✓\n• Arrival time: On schedule\n• Participation: Active\n• Notes: Good focus and engagement')}>View Record</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>December 8, 2024</h4>
                    <span className="assessment-meta">Medical appointment • Excused</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Attendance Record - December 8, 2024\n\n• Status: Excused absence\n• Reason: Medical appointment\n• Documentation: Verified\n• Make-up work: Completed')}>View Record</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'messages' && (
          <>
            <div className="ld-section">
              <h2>Messages with Administration</h2>
              <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', height: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(102, 126, 234, 0.15)', padding: '12px 16px', borderRadius: '12px', marginBottom: '8px', maxWidth: '70%' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#667eea', marginBottom: '4px' }}>Admin - Dr. Michael Chen</div>
                    <div style={{ color: '#2d3748', fontSize: '14px' }}>Hello! I wanted to discuss Alex's progress in Advanced Calculus. He's doing exceptionally well.</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>2 hours ago</div>
                  </div>
                </div>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '12px 16px', borderRadius: '12px', maxWidth: '70%' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>You</div>
                    <div style={{ color: 'white', fontSize: '14px' }}>Thank you for the update! I'm very proud of his achievements.</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>1 hour ago</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '8px', fontSize: '14px', color: '#2d3748' }}
                />
                <button 
                  onClick={async () => { 
                    if(!messageText.trim()) {
                      alert('Please enter a message before sending.');
                      return;
                    }
                    
                    setLoading(true);
                    try {
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      alert(`Message sent successfully!\n\n"${messageText}"\n\nYou will receive a response within 24 hours.`);
                      setMessageText('');
                    } catch (error) {
                      alert('Failed to send message. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading || !messageText.trim()}
                  style={{ padding: '12px 24px', background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px' }}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <div className="ld-section">
              <h2>Profile Information</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Guardian Details</h4>
                    <span className="assessment-meta">
                      Name: {userProfile.userName}<br/>
                      Email: {userProfile.email}<br/>
                      Relationship: Parent/Guardian
                    </span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Profile editing functionality')}>Edit</button>
                </div>
              </div>
            </div>

            <div className="ld-section">
              <h2>Account Settings</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Change Password</h4>
                    <span className="assessment-meta">Update your account password for security</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const newPassword = prompt('Enter new password:');
                    if (newPassword) alert('Password changed successfully!');
                  }}>Change</button>
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
              <h2>Notification Settings</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Performance Alerts</h4>
                    <span className="assessment-meta">Receive notifications about student performance changes</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const enabled = confirm('Enable performance alerts?');
                    alert(enabled ? 'Performance alerts enabled!' : 'Performance alerts disabled!');
                  }}>Configure</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Attendance Alerts</h4>
                    <span className="assessment-meta">Get notified about attendance issues</span>
                  </div>
                  <button className="assessment-status" onClick={() => {
                    const enabled = confirm('Enable attendance alerts?');
                    alert(enabled ? 'Attendance alerts enabled!' : 'Attendance alerts disabled!');
                  }}>Configure</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}