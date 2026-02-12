// Close modal functionality
function initModalHandlers() {
  const closeBtns = document.querySelectorAll('.close-btn, .back-home, .close-case');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.classList.contains('close-btn')) {
        e.preventDefault();
        window.location.hash = '';
      } else if (btn.classList.contains('back-home')) {
        e.preventDefault();
        window.location.hash = '';
      } else if (btn.classList.contains('close-case')) {
        e.preventDefault();
        window.location.hash = '';
      }
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll('.login-page, .case-studies-page').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.location.hash = '';
      }
    });
  });
}

// Initialize modal handlers when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalHandlers);
} else {
  initModalHandlers();
}
