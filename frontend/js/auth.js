// ==============================================
// AUTHENTICATION HANDLERS
// ==============================================

function initAuthHandlers() {
  // -------------------------------------------------
  // 1. USER REGISTRATION
  // -------------------------------------------------
  const userRegisterForm = document.querySelector('#user-register-page form');
  if (userRegisterForm) {
    userRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputs = userRegisterForm.querySelectorAll('input');
      const name = inputs[0]?.value;
      const email = inputs[1]?.value;
      const password = inputs[2]?.value;
      const confirmPassword = inputs[3]?.value;

      if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
      }
      if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
      }

      try {
        const button = userRegisterForm.querySelector('button');
        button.disabled = true;
        button.textContent = 'Creating Account...';

        const data = await apiCall(API_ENDPOINTS.auth.register, {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });

        showNotification('Account Created! Redirecting to login...', 'success');
        setTimeout(() => {
          window.location.hash = '#user-login-page';
          userRegisterForm.reset();
        }, 1500);
      } catch (error) {
        showNotification(error.message || 'Registration failed', 'error');
      } finally {
        const button = userRegisterForm.querySelector('button');
        button.disabled = false;
        button.textContent = 'Create Account';
      }
    });
  }

  // -------------------------------------------------
  // 2. USER LOGIN (FIXED)
  // -------------------------------------------------
  const userLoginForm = document.querySelector('#user-login-page form');
  if (userLoginForm) {
    userLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Try email field as type="email", fallback to type="text", then name="email"
      let emailField = userLoginForm.querySelector('input[type="email"]') ||
                      userLoginForm.querySelector('input[name="email"]') ||
                      userLoginForm.querySelector('input[type="text"]');
      const passwordField = userLoginForm.querySelector('input[type="password"]');

      const email = emailField?.value;
      const password = passwordField?.value;

      if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
      }

      try {
        const button = userLoginForm.querySelector('button');
        button.disabled = true;
        button.textContent = 'Logging in...';

        const data = await apiCall(API_ENDPOINTS.auth.login, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        if (data.token) {
          // ✅ Store token
          localStorage.setItem('token', data.token);
          // ✅ Store full user object (FIX: use data.user, not data.role)
          localStorage.setItem('user', JSON.stringify(data.user));

          showNotification('Login Successful!', 'success');
          setTimeout(() => {
            window.location.href = '/'; // Redirect to homepage/dashboard
          }, 1500);
        }
      } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
      } finally {
        const button = userLoginForm.querySelector('button');
        button.disabled = false;
        button.textContent = 'Sign In';
      }
    });
  }

  // -------------------------------------------------
  // 3. ADMIN LOGIN (FIXED)
  // -------------------------------------------------
  const adminLoginForm = document.querySelector('#admin-login-page form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputs = adminLoginForm.querySelectorAll('input');
      const email = inputs[0]?.value;
      const password = inputs[1]?.value;

      if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
      }

      try {
        const button = adminLoginForm.querySelector('button');
        button.disabled = true;
        button.textContent = 'Logging in...';

        const data = await apiCall(API_ENDPOINTS.auth.login, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        // ✅ Check role from data.user.role (not data.role)
        if (data.token && data.user?.role === 'ADMIN') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          showNotification('Admin Login Successful!', 'success');
          setTimeout(() => {
            window.location.href = '/admin/dashboard.html'; // Adjust to your admin page
          }, 1500);
        } else {
          showNotification('Admin access required', 'error');
        }
      } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
      } finally {
        const button = adminLoginForm.querySelector('button');
        button.disabled = false;
        button.textContent = 'Access Admin Panel';
      }
    });
  }
}

// ==============================================
// NOTIFICATION HELPER (works everywhere)
// ==============================================
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    color: white;
    background: ${type === 'success' ? '#2e7d32' : type === 'error' ? '#d32f2f' : '#1e6091'};
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// ==============================================
// INITIALIZE
// ==============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthHandlers);
} else {
  initAuthHandlers();
}