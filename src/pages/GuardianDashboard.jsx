import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./LearnerDashboard.css";

export default function GuardianDashboard() {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  
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
      { course: "Linear Algebra", grade: "A", score: 94 },
      { course: "Physics II", grade: "A-", score: 91 },
      { course: "Organic Chemistry", grade: "B+", score: 87 }
    ],
    upcomingAssessments: [
      { name: "Calculus Final", date: "Dec 15", type: "Exam" },
      { name: "Physics Lab", date: "Dec 18", type: "Lab Report" }
    ]
  };

  return (
    <div className="ld-wrapper">
      <div className="ld-topbar">
        <div className="header-container">
          <div className="ld-logo">SkillForge AI</div>
          
          <nav className="nav-links">
            <a href="#overview">Overview</a>
            <a href="#performance">Performance</a>
            <a href="#attendance">Attendance</a>
            <a href="#messages">Messages</a>
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
            <p>ID: {userProfile.guardianId}</p>
          </div>
          <button className="ld-menu-item">Settings</button>
          <a href="/" className="ld-logout">Sign Out</a>
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
                <span className="assessment-status">Scheduled</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}