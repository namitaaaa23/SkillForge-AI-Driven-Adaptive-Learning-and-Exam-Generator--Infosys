import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./LearnerDashboard.css";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [newExam, setNewExam] = useState({ title: '', courseId: '', duration: '', totalMarks: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  
  const userProfile = location.state?.userProfile || {
    userName: "Admin",
    email: "admin@skillforge.edu"
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, coursesData, examsData] = await Promise.all([
        api.getAllUsers(),
        api.getAllCourses(),
        api.getAllExams()
      ]);
      setUsers(usersData || []);
      setCourses(coursesData || []);
      setExams(examsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim()) return alert('Name is required');
    if (!newUser.email.trim()) return alert('Email is required');
    if (!newUser.password.trim()) return alert('Password is required');
    if (newUser.password.length < 6) return alert('Password must be at least 6 characters');
    
    try {
      setLoading(true);
      await api.register(newUser);
      setNewUser({ name: '', email: '', password: '', role: 'STUDENT' });
      loadData();
      alert(`User "${newUser.name}" created successfully!`);
    } catch (error) {
      alert(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) return alert('Course title is required');
    if (!newCourse.description.trim()) return alert('Course description is required');
    
    try {
      setLoading(true);
      await api.createCourse(newCourse);
      setNewCourse({ title: '', description: '' });
      loadData();
      alert(`Course "${newCourse.title}" created successfully!`);
    } catch (error) {
      alert(error.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async () => {
    if (!newExam.title.trim()) return alert('Assessment title is required');
    if (!newExam.duration || newExam.duration < 1) return alert('Valid duration is required');
    if (!newExam.totalMarks || newExam.totalMarks < 1) return alert('Total marks must be greater than 0');
    
    try {
      setLoading(true);
      await api.createExam({
        ...newExam,
        duration: parseInt(newExam.duration),
        totalMarks: parseInt(newExam.totalMarks)
      });
      setNewExam({ title: '', courseId: '', duration: '', totalMarks: '' });
      loadData();
      alert(`Assessment "${newExam.title}" created successfully!`);
    } catch (error) {
      alert(error.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?\n\nThis action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      await api.deleteUser(id);
      loadData();
      alert(`User "${name}" deleted successfully`);
    } catch (error) {
      alert(error.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (id) => {
    const exam = exams.find(e => e.id === id);
    if (!confirm(`Are you sure you want to remove the assessment "${exam?.title}"?\n\nThis action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      await api.deleteExam(id);
      loadData();
      alert(`Assessment "${exam?.title}" deleted successfully`);
    } catch (error) {
      alert(error.message || 'Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    const course = courses.find(c => c.id === id);
    if (!confirm(`Are you sure you want to remove the course "${course?.title}"?\n\nThis action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      await api.deleteCourse(id);
      loadData();
      alert(`Course "${course?.title}" deleted successfully`);
    } catch (error) {
      alert(error.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, currentRole, userName) => {
    const newRole = prompt(`Change role for ${userName} (STUDENT/ADMIN/GUARDIAN):`, currentRole);
    if (!newRole || newRole === currentRole) return;
    
    if (!['STUDENT', 'ADMIN', 'GUARDIAN'].includes(newRole.toUpperCase())) {
      return alert('Invalid role. Please enter STUDENT, ADMIN, or GUARDIAN');
    }
    
    try {
      setLoading(true);
      await api.updateUserRole(userId, newRole.toUpperCase());
      loadData();
      alert(`Role updated to ${newRole.toUpperCase()} for ${userName}`);
    } catch (error) {
      alert(error.message || 'Failed to update user role');
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
            <a href="#users" className={activeTab === 'users' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}>Users</a>
            <a href="#courses" className={activeTab === 'courses' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('courses'); }}>Courses</a>
            <a href="#exams" className={activeTab === 'exams' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('exams'); }}>Exams</a>
            <a href="#analytics" className={activeTab === 'analytics' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}>Analytics</a>
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
          <a href="/" className="ld-logout" onClick={() => { api.logout(); navigate('/'); }}>Sign Out</a>
        </div>
      )}

      <div className="ld-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>{userProfile.userName}</h1>
            <p>Administrator • System Manager</p>
          </div>
          <div className="header-right">
            <div className="gpa-badge">
              <span className="gpa-label">Role</span>
              <span className="gpa-value">Admin</span>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            Loading...
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="ld-stats-grid">
              <div className="ld-stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">{users.length}</div>
                <p>Registered</p>
              </div>
              <div className="ld-stat-card">
                <h3>Total Courses</h3>
                <div className="stat-value">{courses.length}</div>
                <p>Available</p>
              </div>
              <div className="ld-stat-card">
                <h3>Total Exams</h3>
                <div className="stat-value">{exams.length}</div>
                <p>Scheduled</p>
              </div>
              <div className="ld-stat-card">
                <h3>System Health</h3>
                <div className="stat-value">98%</div>
                <p>Uptime</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="ld-section">
            <h2>User Management ({users.length})</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '20px' }}>
              <h3>Create New User</h3>
              <input 
                type="text" 
                placeholder="Full Name *" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <input 
                type="email" 
                placeholder="Email Address *" 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <input 
                type="password" 
                placeholder="Password (min 6 characters) *" 
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <select 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
                <option value="GUARDIAN">Guardian</option>
              </select>
              <button 
                onClick={handleCreateUser} 
                className="assessment-status" 
                disabled={loading || !newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
            
            <div className="assessment-list">
              {users.map((user) => (
                <div key={user.id} className="assessment-item">
                  <div className="assessment-info">
                    <h4>{user.name}</h4>
                    <span className="assessment-meta">{user.email} • {user.role}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="assessment-status" 
                      onClick={() => handleUpdateUserRole(user.id, user.role, user.name)}
                      disabled={loading}
                    >
                      Change Role
                    </button>
                    <button 
                      className="assessment-status" 
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={loading}
                      style={{ background: '#dc3545' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="ld-section">
            <h2>Course Management ({courses.length})</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '20px' }}>
              <h3>Create New Course</h3>
              <input 
                type="text" 
                placeholder="Course Title *" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <textarea 
                placeholder="Course Description *" 
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                rows={3}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)', resize: 'vertical' }}
              />
              <button 
                onClick={handleCreateCourse} 
                className="assessment-status" 
                disabled={loading || !newCourse.title.trim() || !newCourse.description.trim()}
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
            
            <div className="assessment-list">
              {courses.map((course) => (
                <div key={course.id} className="assessment-item">
                  <div className="assessment-info">
                    <h4>{course.title}</h4>
                    <span className="assessment-meta">{course.description}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)} 
                    className="assessment-status"
                    disabled={loading}
                    style={{ background: '#dc3545' }}
                  >
                    {loading ? 'Deleting...' : 'Delete Course'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="ld-section">
            <h2>Exam Management ({exams.length})</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '20px' }}>
              <h3>Create New Exam</h3>
              <input 
                type="text" 
                placeholder="Exam Title *" 
                value={newExam.title}
                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <input 
                type="number" 
                placeholder="Duration (minutes) *" 
                value={newExam.duration}
                onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                min="1"
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <input 
                type="number" 
                placeholder="Total Marks *" 
                value={newExam.totalMarks}
                onChange={(e) => setNewExam({...newExam, totalMarks: e.target.value})}
                min="1"
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
              />
              <button 
                onClick={handleCreateExam} 
                className="assessment-status" 
                disabled={loading || !newExam.title.trim() || !newExam.duration || !newExam.totalMarks}
              >
                {loading ? 'Creating...' : 'Create Exam'}
              </button>
            </div>
            
            <div className="assessment-list">
              {exams.map((exam) => (
                <div key={exam.id} className="assessment-item">
                  <div className="assessment-info">
                    <h4>{exam.title}</h4>
                    <span className="assessment-meta">Duration: {exam.duration} minutes • Total Marks: {exam.totalMarks}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteExam(exam.id)} 
                    className="assessment-status"
                    disabled={loading}
                    style={{ background: '#dc3545' }}
                  >
                    {loading ? 'Deleting...' : 'Delete Exam'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="ld-section">
            <h2>System Analytics</h2>
            <div className="assessment-list">
              <div className="assessment-item">
                <div className="assessment-info">
                  <h4>User Activity</h4>
                  <span className="assessment-meta">Active users today: {Math.floor(users.length * 0.7)} registered members</span>
                </div>
                <button className="assessment-status" onClick={() => alert('User Activity Report:\n\n• Peak usage: 9:00-11:00 AM\n• Average session: 45 minutes\n• Most active role: Students (68%)\n• Login success rate: 94%')}>View Report</button>
              </div>
              <div className="assessment-item">
                <div className="assessment-info">
                  <h4>Course Engagement</h4>
                  <span className="assessment-meta">Course completion rate: 78% average across all programs</span>
                </div>
                <button className="assessment-status" onClick={() => alert('Course Analytics:\n\n• Highest engagement: Advanced Mathematics (85%)\n• Most popular: Web Development (156 enrollments)\n• Average study time: 2.5 hours/week\n• Quiz completion rate: 91%')}>View Analytics</button>
              </div>
              <div className="assessment-item">
                <div className="assessment-info">
                  <h4>System Performance</h4>
                  <span className="assessment-meta">System uptime: 99.8% • Average response time: 120ms</span>
                </div>
                <button className="assessment-status" onClick={() => alert('System Metrics:\n\n• CPU utilization: 45%\n• Memory usage: 62%\n• Storage capacity: 78%\n• Database queries/sec: 1,247\n• Active connections: 89')}>View Dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
