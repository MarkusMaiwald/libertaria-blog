// Libertaria Enhanced - Main JavaScript

// Reading Progress Bar
function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

// Navbar Scroll Effect with Progressive Blur
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Use requestAnimationFrame for smooth performance
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Initial check
  updateNavbar();
}

// Active Navigation Indicator
function initActiveNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  function setActiveNav() {
    const scrollPos = window.scrollY + 100; // Offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.removeAttribute('aria-current');
          link.classList.remove('active');

          if (link.getAttribute('href') === `#${sectionId}`) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('active');
          }
        });
      }
    });

    // Handle top of page (Home)
    if (scrollPos < 100) {
      navLinks.forEach(link => {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.setAttribute('aria-current', 'page');
          link.classList.add('active');
        }
      });
    }
  }

  // Use requestAnimationFrame for smooth updates
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Set initial active state
  setActiveNav();

  // Handle click events for smooth scroll with active state
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Only handle internal anchor links
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update active state immediately for better UX
          navLinks.forEach(l => {
            l.removeAttribute('aria-current');
            l.classList.remove('active');
          });
          link.setAttribute('aria-current', 'page');
          link.classList.add('active');
        }
      }
    });
  });
}

// Particle System for Hero
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const particleCount = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    this.particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#ffd700' : '#ff1a1a',
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle, i) => {
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx += (dx / dist) * force * 0.02;
          particle.vy += (dy / dist) * force * 0.02;
        }
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = particle.color;
          this.ctx.globalAlpha = (1 - dist / 100) * 0.2;
          this.ctx.stroke();
        }
      }
    });

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// Scroll Reveal Animation
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => observer.observe(reveal));
}

// Blog Search and Filter
function initBlogFilter() {
  const searchInput = document.getElementById('blog-search');
  const tagFilters = document.querySelectorAll('.tag-filter');
  const blogCards = document.querySelectorAll('.blog-card');
  
  let activeTag = 'all';
  let searchTerm = '';

  function filterPosts() {
    blogCards.forEach(card => {
      const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
      const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.blog-card-tag')).map(tag => tag.textContent.toLowerCase());
      
      const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
      const matchesTag = activeTag === 'all' || tags.some(tag => tag.includes(activeTag.toLowerCase()));
      
      if (matchesSearch && matchesTag) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      filterPosts();
    });
  }

  tagFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      tagFilters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      activeTag = filter.dataset.tag;
      filterPosts();
    });
  });
}

// Stack Card Interactions
function initStackCards() {
  const stackCards = document.querySelectorAll('.stack-card');
  
  stackCards.forEach(card => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      
      // Close all cards
      stackCards.forEach(c => c.classList.remove('expanded'));
      
      // Toggle current card
      if (!isExpanded) {
        card.classList.add('expanded');
      }
    });
  });
}

// Newsletter Form
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  // Add aria-live region for success announcements
  form.setAttribute('aria-live', 'polite');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    
    if (email) {
      // Show success message
      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      btn.innerHTML = '✓ Subscribed!';
      btn.classList.add('btn-success');
      btn.classList.remove('btn-red');
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-red');
        form.reset();
      }, 3000);
    }
  });
}

// Stats Counter Animation
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-value');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const text = target.textContent;
        
        // Skip infinity symbol and non-numeric values
        if (text.includes('∞') || isNaN(parseInt(text))) {
          observer.unobserve(target);
          return;
        }
        
        const value = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');
        let current = 0;
        const increment = value / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            target.textContent = value + suffix;
            clearInterval(counter);
          } else {
            target.textContent = Math.floor(current) + suffix;
          }
        }, stepTime);
        
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Typing Effect for Hero
function initTypingEffect() {
  const element = document.querySelector('.typing-effect');
  if (!element) return;

  const text = element.textContent;
  element.textContent = '';
  element.style.opacity = '1';
  
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  };
  
  setTimeout(typeWriter, 500);
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  initReadingProgress();
  initNavbarScroll();
  initActiveNavigation();
  initScrollReveal();
  initBlogFilter();
  initStackCards();
  initNewsletter();
  initStatsCounter();
  initSmoothScroll();
  initTypingEffect();

  // Initialize particle system
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    new ParticleSystem(canvas);
  }
});

// Add fadeIn animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
