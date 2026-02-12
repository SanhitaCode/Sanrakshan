function initSOSHandlers() {
  const sosButtons = document.querySelectorAll('.sos-click, .btn-sos-main');

  sosButtons.forEach((sosBtn) => {
    sosBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (!isAuthenticated()) {
        showNotification('Please login first to trigger SOS', 'error');
        return;
      }
      
      if (!confirm('Are you sure you want to trigger an SOS alert?')) {
        return;
      }
      
      try {
        sosBtn.disabled = true;
        const originalText = sosBtn.innerHTML;
        sosBtn.innerHTML = '<i class="fas fa-spinner" style="animation: spin 1s linear infinite;"></i> Sending...';
        
        const data = await apiCall(API_ENDPOINTS.sos.trigger, {
          method: 'POST',
          body: JSON.stringify({ location: 'Emergency Location' }),
        });
        
        showNotification('SOS Alert Sent Successfully!', 'success');
      } catch (error) {
        showNotification(error.message || 'Failed to trigger SOS', 'error');
      } finally {
        sosBtn.disabled = false;
        sosBtn.innerHTML = originalText;
      }
    });
  });

  const style = document.createElement('style');
  style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}

// Initialize SOS handlers when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSOSHandlers);
} else {
  initSOSHandlers();
}
