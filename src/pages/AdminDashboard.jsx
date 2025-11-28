import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./LearnerDashboard.css";

export default function AdminDashboard() {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  
  const userProfile = location.state?.userProfile || {
    userName: "Dr. Michael Chen",
    email: "admin@skillforge.edu",
    adminId: "ADM001",
    department: "Academic Affairs",
    institution: "Stanford University",
    accessLevel: "Full Access"
  };

  const adminData = {
    totalStudents: 1248,
    activeCourses: 42,
    pendingReviews: 6,
    activeInstructors: 28,
    avgCompletion: 78,
    systemHealth: 98,
    recentActivity: [
      { action: "New course created", user: "Dr. Smith", time: "2 hours ago" },
      { action: "Assessment published", user: "Prof. Johnson", time: "4 hours ago" },
      { action: "Student enrolled", user: "System", time: "5 hours ago" }
    ],
    pendingTasks: [
      { task: "Review AI-generated content", priority: "High", count: 6 },
      { task: "Approve course updates", priority: "Medium", count: 3 },
      { task: "User access requests", priority: "Low", count: 2 }
    ]
  };

  return (
    <div className="ld-wrapper">
      <div className="ld-topbar">
        <div className="header-container">
          <div className="ld-logo">SkillForge AI</div>
          
          <nav className="nav-links">
            <a href="#dashboard">Dashboard</a>
            <a href="#courses">Courses</a>
            <a href="#users">Users</a>
            <a href="#analytics">Analytics</a>
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
            <p>ID: {userProfile.adminId}</p>
          </div>
          <button className="ld-menu-item">Settings</button>
          <a href="/" className="ld-logout">Sign Out</a>
        </div>
      )}

      <div className="ld-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Admin Control Center</h1>
            <p>{userProfile.department} • {userProfile.institution}</p>
          </div>
          <div className="header-right">
            <div className="gpa-badge">
              <span className="gpa-label">System</span>
              <span className="gpa-value">{adminData.systemHealth}%</span>
            </div>
          </div>
        </div>

        <div className="ld-stats-grid">
          <div className="ld-stat-card">
            <h3>Total Students</h3>
            <div className="stat-value">{adminData.totalStudents}</div>
            <p>Active Learners</p>
          </div>

          <div className="ld-stat-card">
            <h3>Active Courses</h3>
            <div className="stat-value">{adminData.activeCourses}</div>
            <p>{adminData.activeInstructors} Instructors</p>
          </div>

          <div className="ld-stat-card">
            <h3>Pending Reviews</h3>
            <div className="stat-value">{adminData.pendingReviews}</div>
            <p>Requires Attention</p>
          </div>

          <div className="ld-stat-card">
            <h3>Avg Completion</h3>
            <div className="stat-value">{adminData.avgCompletion}%</div>
            <p>Platform-wide</p>
          </div>
        </div>

        <div className="ld-section">
          <h2>Pending Tasks</h2>
          <div className="assessment-list">
            {adminData.pendingTasks.map((task, index) => (
              <div key={index} className="assessment-item">
                <div className="assessment-info">
                  <h4>{task.task}</h4>
                  <span className="assessment-meta">{task.count} items • Priority: {task.priority}</span>
                </div>
                <button className="assessment-status" style={{ cursor: 'pointer' }}>Review</button>
              </div>
            ))}
          </div>
        </div>

        <div className="ld-section">
          <h2>Recent Activity</h2>
          <div className="performance-grid">
            {adminData.recentActivity.map((activity, index) => (
              <div key={index} className="performance-item">
                <div className="performance-course">{activity.action}</div>
                <div className="performance-score">
                  <span className="score-value" style={{ fontSize: '14px' }}>{activity.user}</span>
                  <span className="score-grade" style={{ fontSize: '12px' }}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}