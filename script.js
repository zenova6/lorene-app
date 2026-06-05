/* Lorene — Shade of Thoughts Bot */
/* Enhanced JavaScript */

// Scroll reveal animation with staggered timing
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 55);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  
  // Initialize mobile menu toggle
  initMobileMenu();
  
  // Initialize navbar scroll effect
  initNavbarScroll();
  
  // Initialize command copy functionality
  initCommandCopy();
  
  // Initialize status bar auto-refresh
  fetchStatus();
  setInterval(fetchStatus, 30000); // Refresh every 30 seconds
  
  // Initialize fish card tilt effect
  initFishTilt();
});

// Mobile menu toggle
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }
}

// Navbar scroll effect
function initNavbarScroll() {
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

// Tab switching for commands
function switchTab(id, btn) {
  document.querySelectorAll('.cmd-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cmd-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
}

// Format uptime display
function fmtUptime(s) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return d + 'd ' + h + 'h';
  if (h > 0) return h + 'h ' + m + 'm';
  return m + 'm ' + (s % 60) + 's';
}

// Fetch bot status from API
async function fetchStatus() {
  const bar   = document.getElementById('statusBar');
  const label = document.getElementById('sLabel');
  const up    = document.getElementById('sUptime');
  const ping  = document.getElementById('sPing');
  
  if (!bar) return;
  
  try {
    const res  = await fetch('/api/status', { 
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (!res.ok) throw new Error('API error');
    
    const data = await res.json();
    bar.classList.remove('loading', 'online', 'offline');
    
    if (data.status === 'online') {
      bar.classList.add('online');
      label.textContent = 'Online';
      up.textContent    = fmtUptime(data.uptime);
      ping.textContent  = data.ping + 'ms';
    } else {
      throw new Error('Bot offline');
    }
  } catch (err) {
    bar.classList.remove('loading');
    bar.classList.add('offline');
    label.textContent = 'Offline';
    up.textContent    = '--';
    ping.textContent  = '--';
    console.log('Status fetch failed:', err.message);
  }
}

// Command copy functionality
function initCommandCopy() {
  const cmdItems = document.querySelectorAll('.cmd-item');
  
  cmdItems.forEach(item => {
    item.addEventListener('click', async () => {
      const codeEl = item.querySelector('code');
      if (!codeEl) return;
      
      const command = codeEl.textContent.replace(/<|>/g, '').trim();
      
      try {
        await navigator.clipboard.writeText(command);
        showToast(`Copied: ${command}`);
        
        // Visual feedback
        item.style.borderColor = 'var(--teal)';
        setTimeout(() => {
          item.style.borderColor = '';
        }, 500);
      } catch (err) {
        console.log('Copy failed:', err);
      }
    });
  });
}

// Toast notification system
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Auto-remove after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Fish card tilt effect
function initFishTilt() {
  const fishCards = document.querySelectorAll('.fish-card');
  
  fishCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Add loading state to buttons on click
document.querySelectorAll('.btn-main, .btn-ghost').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.getAttribute('href')?.startsWith('#')) {
      return;
    }
    
    const originalText = this.innerHTML;
    this.classList.add('loading');
    this.innerHTML = '<span class="loading-spinner"></span> Loading...';
    
    setTimeout(() => {
      this.classList.remove('loading');
      this.innerHTML = originalText;
    }, 2000);
  });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// Parallax effect for blobs
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const blobs = document.querySelectorAll('.blob');
  
  blobs.forEach((blob, index) => {
    const speed = 0.1 + (index * 0.05);
    blob.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// Keyboard navigation for command tabs
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && e.target.classList.contains('cmd-tab')) {
    // Allow natural tab navigation
    return;
  }
  
  // Arrow key navigation for tabs
  if (e.target.classList.contains('cmd-tab')) {
    const tabs = Array.from(document.querySelectorAll('.cmd-tab'));
    const currentIndex = tabs.indexOf(e.target);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[prevIndex].focus();
      tabs[prevIndex].click();
    }
  }
});

// Performance optimization: Lazy load images if any
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add page transition effect
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Service Worker registration for PWA (optional future enhancement)
if ('serviceWorker' in navigator) {
  // Uncomment to enable PWA support
  // navigator.serviceWorker.register('/sw.js');
}

console.log('🎣 Lorene Bot website loaded successfully!');
