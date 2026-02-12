// API Configuration
const API_BASE_URL = 'https://sanrakshan-backend.onrender.com/api';
const SOCKET_URL = 'https://sanrakshan-backend.onrender.com';

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
    }
};
// ==============================================
// API Call Helper – use this for all fetch requests
// ==============================================
async function apiCall(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add auth token if exists
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses (like HTML errors)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }
      return data;
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
    }
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}