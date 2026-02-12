// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

// API endpoints
const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
  },
  alerts: {
    create: `${API_BASE_URL}/alerts`,
    getAll: `${API_BASE_URL}/alerts`,
  },
  sos: {
    trigger: `${API_BASE_URL}/sos`,
  },
};

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

// Helper function for API calls
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

// Get current user data from localStorage
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Set user data
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// Logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}
