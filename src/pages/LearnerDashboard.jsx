import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LearnerDashboard.css";

export default function LearnerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  
  const userProfile = location.state?.userProfile || {
    userName: "Alex Johnson",
    email: "alex@school.edu",
    studentId: "STU001",
    institution: "Stanford University",
    role: "Student"
  };

  const dashboardData = {
    rank: 12,
    totalStudents: 847,
    currentModule: "Advanced Calculus",
    moduleProgress: 73,
    gpa: 3.85,
    completedCourses: 8,
    activeCourses: 4,
    upcomingAssessments: [
      { name: "Calculus Final", date: "Dec 15", type: "Exam" },
      { name: "Physics Lab", date: "Dec 18", type: "Lab Report" },
      { name: "Chemistry Quiz", date: "Dec 20", type: "Quiz" }
    ],
    recentGrades: [
      { course: "Linear Algebra", grade: "A", score: 94 },
      { course: "Physics II", grade: "A-", score: 91 },
      { course: "Organic Chemistry", grade: "B+", score: 87 }
    ],
    studyStreak: 15,
    weeklyGoal: 25,
    weeklyProgress: 18
  };

  return (
    <div className="ld-wrapper">
      <div className="ld-topbar">
        <div className="header-container">
          <div className="ld-logo">SkillForge AI</div>
          
          <nav className="nav-links">
            <a href="/learner-content" onClick={(e) => { e.preventDefault(); navigate('/learner-content', { state: { userProfile } }); }}>Content</a>
            <a href="#progress">Progress</a>
            <a href="#settings">Settings</a>
            <a href="#profile">Profile</a>
          </nav>
          
          <div className="ld-topbar-right">
            <div 
              className="ld-avatar" 
              onClick={() => setShowMenu(!showMenu)}
            >
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
            <p>ID: {userProfile.studentId}</p>
          </div>
          <button className="ld-menu-item">Settings</button>
          <a href="/" className="ld-logout">Sign Out</a>
        </div>
      )}

      <div className="ld-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>{userProfile.userName}</h1>
            <p>{userProfile.institution} • {userProfile.studentId}</p>
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
            <div className="stat-value">{dashboardData.activeCourses}</div>
            <p>{dashboardData.completedCourses} Completed</p>
          </div>

          <div className="ld-stat-card">
            <h3>Assessments</h3>
            <div className="stat-value">{dashboardData.upcomingAssessments.length}</div>
            <p>Upcoming</p>
          </div>

          <div className="ld-stat-card">
            <h3>Study Streak</h3>
            <div className="stat-value">{dashboardData.studyStreak}</div>
            <p>Days Consistent</p>
          </div>
        </div>

        <div className="ld-section">
          <h2>Current Learning Path</h2>
          <div className="ld-progress-card">
            <div className="progress-header">
              <div>
                <h3>{dashboardData.currentModule}</h3>
                <p>Chapter 7: Integration Techniques</p>
              </div>
              <span className="progress-percent">{dashboardData.moduleProgress}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${dashboardData.moduleProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="ld-section">
          <h2>AI-Generated Assessments</h2>
          <div className="assessment-list">
            {dashboardData.upcomingAssessments.map((assessment, index) => (
              <div key={index} className="assessment-item">
                <div className="assessment-info">
                  <h4>{assessment.name}</h4>
                  <span className="assessment-meta">{assessment.type} • {assessment.date}</span>
                </div>
                <span className="assessment-status">Scheduled</span>
              </div>
            ))}
          </div>
        </div>

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
      </div>

      <div className="ld-ai-assistant">
        <div className="ld-ai-icon">AI</div>
      </div>
    </div>
  );
}