import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "./LearnerDashboard.css";

export default function TeacherDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [newExam, setNewExam] = useState({ title: '', courseId: '', duration: '', totalMarks: '' });
  const [newQuestion, setNewQuestion] = useState({ 
    questionText: '', 
    optionA: '', 
    optionB: '', 
    optionC: '', 
    optionD: '', 
    correctAnswer: 'A',
    difficulty: 'MEDIUM',
    topic: '',
    courseId: ''
  });
  const [loading, setLoading] = useState(false);
  
  const userProfile = location.state?.userProfile || {
    userName: "Dr. Sarah Wilson",
    email: "teacher@skillforge.edu"
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesData, examsData, questionsData] = await Promise.all([
        api.getAllCourses(),
        api.getAllExams(),
        api.getAllQuestions()
      ]);
      setCourses(coursesData || []);
      setExams(examsData || []);
      setQuestions(questionsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        navigate('/teacher-login');
      }
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
    if (!newExam.title.trim()) return alert('Exam title is required');
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
      alert(`Exam "${newExam.title}" created successfully!`);
    } catch (error) {
      alert(error.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.questionText.trim()) return alert('Question text is required');
    if (!newQuestion.optionA.trim() || !newQuestion.optionB.trim() || 
        !newQuestion.optionC.trim() || !newQuestion.optionD.trim()) {
      return alert('All options are required');
    }
    
    try {
      setLoading(true);
      await api.createQuestion(newQuestion);
      setNewQuestion({ 
        questionText: '', 
        optionA: '', 
        optionB: '', 
        optionC: '', 
        optionD: '', 
        correctAnswer: 'A',
        difficulty: 'MEDIUM',
        topic: '',
        courseId: ''
      });
      loadData();
      alert('Question created successfully!');
    } catch (error) {
      alert(error.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    const course = courses.find(c => c.id === id);
    if (!confirm(`Delete course "${course?.title}"?\n\nThis action cannot be undone.`)) return;
    
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

  const handleDeleteExam = async (id) => {
    const exam = exams.find(e => e.id === id);
    if (!confirm(`Delete exam "${exam?.title}"?\n\nThis action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      await api.deleteExam(id);
      loadData();
      alert(`Exam "${exam?.title}" deleted successfully`);
    } catch (error) {
      alert(error.message || 'Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    const question = questions.find(q => q.id === id);
    if (!confirm(`Delete this question?\n\n"${question?.questionText?.substring(0, 50)}..."\n\nThis action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      await api.deleteQuestion(id);
      loadData();
      alert('Question deleted successfully');
    } catch (error) {
      alert(error.message || 'Failed to delete question');
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
            <a href="#courses" className={activeTab === 'courses' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('courses'); }}>Courses</a>
            <a href="#exams" className={activeTab === 'exams' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('exams'); }}>Exams</a>
            <a href="#questions" className={activeTab === 'questions' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('questions'); }}>Questions</a>
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
            <p>Teacher • Course Instructor</p>
          </div>
          <div className="header-right">
            <div className="gpa-badge">
              <span className="gpa-label">Role</span>
              <span className="gpa-value">Teacher</span>
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
                <h3>My Courses</h3>
                <div className="stat-value">{courses.length}</div>
                <p>Active</p>
              </div>
              <div className="ld-stat-card">
                <h3>Total Exams</h3>
                <div className="stat-value">{exams.length}</div>
                <p>Created</p>
              </div>
              <div className="ld-stat-card">
                <h3>Question Bank</h3>
                <div className="stat-value">{questions.length}</div>
                <p>Questions</p>
              </div>
              <div className="ld-stat-card">
                <h3>Students</h3>
                <div className="stat-value">156</div>
                <p>Enrolled</p>
              </div>
            </div>

            <div className="ld-section">
              <h2>Recent Activity</h2>
              <div className="assessment-list">
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Course Content Updated</h4>
                    <span className="assessment-meta">Advanced Mathematics • 2 hours ago</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Course: Advanced Mathematics\nLast Updated: 2 hours ago\nNew content: Chapter 7 - Integration Techniques')}>View Details</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>New Student Enrollments</h4>
                    <span className="assessment-meta">12 new students • Today</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('New Enrollments Today:\n• Physics II: 5 students\n• Chemistry: 4 students\n• Mathematics: 3 students')}>View Students</button>
                </div>
                <div className="assessment-item">
                  <div className="assessment-info">
                    <h4>Exam Results Available</h4>
                    <span className="assessment-meta">Midterm Physics • Yesterday</span>
                  </div>
                  <button className="assessment-status" onClick={() => alert('Midterm Physics Results:\n• Average Score: 78%\n• Highest Score: 96%\n• Completion Rate: 94%')}>View Results</button>
                </div>
              </div>
            </div>
          </>
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="assessment-status" 
                      onClick={() => alert(`Course: ${course.title}\n\nDescription: ${course.description}\n\nEnrollments: ${Math.floor(Math.random() * 50) + 10} students\nCompletion Rate: ${Math.floor(Math.random() * 30) + 70}%`)}
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)} 
                      className="assessment-status"
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="assessment-status" 
                      onClick={() => alert(`Exam: ${exam.title}\n\nDuration: ${exam.duration} minutes\nTotal Marks: ${exam.totalMarks}\n\nAttempts: ${Math.floor(Math.random() * 20) + 5}\nAverage Score: ${Math.floor(Math.random() * 30) + 70}%`)}
                    >
                      View Results
                    </button>
                    <button 
                      onClick={() => handleDeleteExam(exam.id)} 
                      className="assessment-status"
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

        {activeTab === 'questions' && (
          <div className="ld-section">
            <h2>Question Bank ({questions.length})</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '20px' }}>
              <h3>Add New Question</h3>
              <textarea 
                placeholder="Question Text *" 
                value={newQuestion.questionText}
                onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                rows={3}
                style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)', resize: 'vertical' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Option A *" 
                  value={newQuestion.optionA}
                  onChange={(e) => setNewQuestion({...newQuestion, optionA: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                />
                <input 
                  type="text" 
                  placeholder="Option B *" 
                  value={newQuestion.optionB}
                  onChange={(e) => setNewQuestion({...newQuestion, optionB: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                />
                <input 
                  type="text" 
                  placeholder="Option C *" 
                  value={newQuestion.optionC}
                  onChange={(e) => setNewQuestion({...newQuestion, optionC: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                />
                <input 
                  type="text" 
                  placeholder="Option D *" 
                  value={newQuestion.optionD}
                  onChange={(e) => setNewQuestion({...newQuestion, optionD: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <select 
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                >
                  <option value="A">Correct: A</option>
                  <option value="B">Correct: B</option>
                  <option value="C">Correct: C</option>
                  <option value="D">Correct: D</option>
                </select>
                <select 
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Topic/Subject" 
                  value={newQuestion.topic}
                  onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.5)' }}
                />
              </div>
              <button 
                onClick={handleCreateQuestion} 
                className="assessment-status" 
                disabled={loading || !newQuestion.questionText.trim() || !newQuestion.optionA.trim() || !newQuestion.optionB.trim() || !newQuestion.optionC.trim() || !newQuestion.optionD.trim()}
              >
                {loading ? 'Adding...' : 'Add Question'}
              </button>
            </div>
            
            <div className="assessment-list">
              {questions.map((question) => (
                <div key={question.id} className="assessment-item">
                  <div className="assessment-info">
                    <h4>{question.questionText?.substring(0, 80)}...</h4>
                    <span className="assessment-meta">
                      Difficulty: {question.difficulty} • Correct: {question.correctAnswer}
                      {question.topic && ` • Topic: ${question.topic}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="assessment-status" 
                      onClick={() => alert(`Question: ${question.questionText}\n\nA) ${question.optionA}\nB) ${question.optionB}\nC) ${question.optionC}\nD) ${question.optionD}\n\nCorrect Answer: ${question.correctAnswer}\nDifficulty: ${question.difficulty}`)}
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(question.id)} 
                      className="assessment-status"
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

        {activeTab === 'analytics' && (
          <div className="ld-section">
            <h2>Teaching Analytics</h2>
            <div className="assessment-list">
              <div className="assessment-item">
                <div className="assessment-info">
                  <h4>Student Performance</h4>
                  <span className="assessment-meta">Average class performance: 82% • Top performer: 96%</span>
                </div>
                <button className="assessment-status" onClick={() => alert('Student Performance Analytics:\n\n• Class Average: 82%\n• Highest Score: 96%\n• Lowest Score: 64%\n• Students Above 90%: 23\n• Students Below 70%: 8\n• Improvement Rate: +12% this month')}>View Report</button>
              </div>
              <div className="assessment-item">
                <div className="assessment-info">
                  <h4>Course Engagement</h4>
                  <span className="assessment-meta">Active participation: 89% • Assignment completion: 94%</span>
                </div>
                <button className="assessment-status" onClick={() => alert('Course Engagement Metrics:\n\n• Daily Active Students: 89%\n• Assignment Completion: 94%\n• Discussion Participation: 76%\n• Video Watch Time: 85%\n• Quiz Attempts: 91%\n• Most Engaged Course: Advanced Mathematics')}>View Details</button>
              </div>
              <div className="assessment-item">
                <div className="assessment-info">
                  <h4>Content Effectiveness</h4>
                  <span className="assessment-meta">Most effective: Video lectures (92%) • Needs improvement: PDFs (67%)</span>
                </div>
                <button className="assessment-status" onClick={() => alert('Content Effectiveness Analysis:\n\n• Video Lectures: 92% effectiveness\n• Interactive Quizzes: 88% effectiveness\n• PDF Materials: 67% effectiveness\n• Live Sessions: 95% effectiveness\n\nRecommendation: Increase interactive content and reduce PDF-only materials')}>View Analysis</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}