// Newsletter subscription handler
// Connects the frontend form to the Cloudflare Worker API

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput?.value?.trim();
    
    if (!email) {
      showMessage('Please enter your email', 'error');
      return;
    }
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';
    
    try {
      const response = await fetch('https://api.libertaria.app/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'website',
          // Optional: capture Moltbook ID if user is logged in
          // moltId: getMoltIdFromCookie()
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('✓ Check your email to confirm!', 'success');
        emailInput.value = '';
        
        // Track conversion
        if (typeof gtag !== 'undefined') {
          gtag('event', 'newsletter_subscribe', { email });
        }
      } else {
        showMessage(data.error || 'Subscription failed. Try again.', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
    }
  });
  
  function showMessage(text, type) {
    // Remove existing messages
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();
    
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;
    message.style.cssText = `
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      ${type === 'success' 
        ? 'background: rgba(0, 212, 170, 0.1); color: #00d4aa; border: 1px solid #00d4aa;' 
        : 'background: rgba(255, 26, 26, 0.1); color: #ff1a1a; border: 1px solid #ff1a1a;'
      }
    `;
    
    form.appendChild(message);
    
    // Auto-remove after 5 seconds
    setTimeout(() => message.remove(), 5000);
  }
});

// Track subscriber count display
async function updateSubscriberCount() {
  try {
    const response = await fetch('https://api.libertaria.app/stats');
    const data = await response.json();
    
    const countElement = document.getElementById('subscriber-count');
    if (countElement && data.subscribers) {
      countElement.textContent = `${data.subscribers} agents subscribed`;
    }
  } catch (error) {
    console.log('Stats fetch failed (expected during development)');
  }
}

// Update count on page load
updateSubscriberCount();
