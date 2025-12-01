import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LearnerContent.css";

export default function LearnerContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const userProfile = location.state?.userProfile || {
    userName: "Alex Johnson",
    email: "alex@school.edu",
    studentId: "STU001",
    institution: "Stanford University",
    role: "Student"
  };

  const topics = [
    { id: 1, title: "Introduction to Calculus", course: "Calculus I", instructor: "Dr. Smith", progress: 45 },
    { id: 2, title: "Derivatives and Applications", course: "Calculus I", instructor: "Dr. Smith", progress: 78 },
    { id: 3, title: "Integration Techniques", course: "Calculus II", instructor: "Dr. Williams", progress: 23 },
    { id: 4, title: "Limits and Continuity", course: "Calculus I", instructor: "Prof. Brown", progress: 90 },
    { id: 5, title: "Differential Equations", course: "Calculus II", instructor: "Dr. Williams", progress: 12 },
    { id: 6, title: "Vector Calculus", course: "Applied Math", instructor: "Prof. Davis", progress: 0 }
  ];

  const handleFormatSelect = (topicId, format) => {
    console.log(`Opening ${format} for topic ${topicId}`);
  };

  return (
    <div className="lc-wrapper">
      <div className="lc-topbar">
        <div className="header-container">
          <div className="lc-logo" onClick={() => navigate("/learner-dashboard", { state: { userProfile } })}>SkillForge AI</div>
          
          <nav className="nav-links">
            <a href="/learner-dashboard" onClick={(e) => { e.preventDefault(); navigate("/learner-dashboard", { state: { userProfile } }); }}>Dashboard</a>
            <a href="/learner-content" className="active">Content</a>
            <a href="#progress">Progress</a>
            <a href="#settings">Settings</a>
          </nav>
          
          <div className="lc-topbar-right">
            <div 
              className="lc-avatar" 
              onClick={() => setShowMenu(!showMenu)}
            >
              {userProfile.userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="lc-menu-panel">
          <div className="lc-user-info">
            <h3>{userProfile.userName}</h3>
            <p>{userProfile.email}</p>
            <p>ID: {userProfile.studentId}</p>
          </div>
          <button className="lc-menu-item">Settings</button>
          <a href="/" className="lc-logout">Sign Out</a>
        </div>
      )}

      <div className="lc-main">
        <div className="lc-header">
          <h1>Learning Content Library</h1>
          <p>Access course materials in multiple formats</p>
        </div>

        <div className="lc-topics-grid">
          {topics.map((topic) => (
            <div key={topic.id} className="lc-topic-card">
              <div className="lc-topic-header">
                <div className="lc-topic-info">
                  <h3>{topic.title}</h3>
                  <div className="lc-topic-meta">
                    <span className="lc-course-tag">{topic.course}</span>
                    <span className="lc-instructor">{topic.instructor}</span>
                  </div>
                </div>
                <div className="lc-progress-circle">
                  <svg width="60" height="60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                    <circle cx="30" cy="30" r="26" fill="none" stroke="url(#gradient)" strokeWidth="4" 
                      strokeDasharray={`${topic.progress * 1.63} 163`} strokeLinecap="round" transform="rotate(-90 30 30)"/>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#667eea"/>
                        <stop offset="100%" stopColor="#764ba2"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="lc-progress-text">{topic.progress}%</span>
                </div>
              </div>

              <div className="lc-format-section">
                <p className="lc-format-label">Select Learning Format</p>
                <div className="lc-format-grid">
                  <button className="lc-format-card pdf" onClick={() => handleFormatSelect(topic.id, 'pdf')}>
                    <div className="format-icon-wrapper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <span className="format-name">PDF Document</span>
                    <span className="format-desc">Read & Download</span>
                  </button>
                  <button className="lc-format-card blog" onClick={() => handleFormatSelect(topic.id, 'blog')}>
                    <div className="format-icon-wrapper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </div>
                    <span className="format-name">Blog Article</span>
                    <span className="format-desc">Interactive Reading</span>
                  </button>
                  <button className="lc-format-card video" onClick={() => handleFormatSelect(topic.id, 'video')}>
                    <div className="format-icon-wrapper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </div>
                    <span className="format-name">Video Lesson</span>
                    <span className="format-desc">With Transcript</span>
                  </button>
                  <button className="lc-format-card quiz" onClick={() => handleFormatSelect(topic.id, 'quiz')}>
                    <div className="format-icon-wrapper">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <span className="format-name">AI Quiz</span>
                    <span className="format-desc">Adaptive Test</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
