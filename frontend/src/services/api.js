const API_URL = 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const api = {
  // Auth
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data.user;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Users
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to create user');
    return data.data;
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update user');
    return data.data;
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete user');
    return data.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update user role');
    return data.data;
  },

  // Courses
  getAllCourses: async () => {
    const response = await fetch(`${API_URL}/courses`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  getCourseById: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch course');
    return data.data;
  },

  createCourse: async (courseData) => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to create course');
    return data.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update course');
    return data.data;
  },

  deleteCourse: async (id) => {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete course');
    return data.data;
  },

  // Exams
  getAllExams: async () => {
    const response = await fetch(`${API_URL}/exams`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  createExam: async (examData) => {
    const response = await fetch(`${API_URL}/exams`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(examData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to create exam');
    return data.data;
  },

  updateExam: async (examId, examData) => {
    const response = await fetch(`${API_URL}/exams/${examId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(examData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update exam');
    return data.data;
  },

  deleteExam: async (id) => {
    const response = await fetch(`${API_URL}/exams/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete exam');
    return data.data;
  },

  // Questions
  getAllQuestions: async () => {
    const response = await fetch(`${API_URL}/questions`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    return data.success ? data.data : [];
  },

  createQuestion: async (questionData) => {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to create question');
    return data.data;
  },

  updateQuestion: async (questionId, questionData) => {
    const response = await fetch(`${API_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(questionData)
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to update question');
    return data.data;
  },

  deleteQuestion: async (id) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete question');
    return data.data;
  }
};
