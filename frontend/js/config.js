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