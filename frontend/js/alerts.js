let socket;
try {
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
  
  socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
  });
  
  socket.on('newAlert', (alert) => {
    console.log('New Alert received:', alert);
    displayAlert(alert);
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
} catch (err) {
  console.warn('Socket.IO not available:', err);
}

async function loadAlerts() {
  try {
    const alerts = await apiCall(API_ENDPOINTS.alerts.getAll, {
      method: 'GET',
    });
    
    const alertFeed = document.querySelector('.alertness-feed');
    if (alertFeed && alerts.length > 0) {
      const alertsContainer = alertFeed.querySelector('.alert-list') || alertFeed;
      alerts.forEach(alert => displayAlert(alert, alertsContainer));
    }
  } catch (error) {
    console.error('Error loading alerts:', error);
  }
}

function displayAlert(alert, container = null) {
  if (!container) {
    container = document.querySelector('.alertness-feed');
  }
  
  const alertElement = document.createElement('div');
  alertElement.className = 'alert-card';
  if (alert.status === 'approved' || alert.approved) {
    alertElement.classList.add('approved');
  }
  
  const timestamp = new Date(alert.createdAt || Date.now()).toLocaleString();
  const status = alert.status || (alert.approved ? 'approved' : 'pending');
  
  alertElement.innerHTML = `
    <div class="alert-info">
      <div class="alert-icon">
        <i class="fas fa-${alert.severity === 'critical' ? 'exclamation-circle' : 'info-circle'}"></i>
      </div>
      <div class="alert-meta">
        <h4>${alert.title || 'Alert'}</h4>
        <p>${alert.description || 'No description'}</p>
        <small>${timestamp}</small>
      </div>
    </div>
    ${status === 'approved' ? '<span class="approval-stamp"><i class="fas fa-check-circle"></i> APPROVED</span>' : ''}
  `;
  
  if (container.querySelector('.alert-list')) {
    container.querySelector('.alert-list').insertBefore(alertElement, container.querySelector('.alert-list').firstChild);
  } else {
    container.insertBefore(alertElement, container.querySelector('.feed-header')?.nextSibling);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAlerts);
} else {
  loadAlerts();
}
