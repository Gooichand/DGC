// 3D Pin Effect for Project Links
class ProjectPinEffect {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupPinEffects());
    } else {
      this.setupPinEffects();
    }
  }

  setupPinEffects() {
    // Find all project cards
    const projectCards = document.querySelectorAll('.project-parent');
    
    projectCards.forEach(card => {
      // Find the social buttons container
      const socialButtons = card.querySelector('.project-social-buttons');
      if (!socialButtons) return;

      // Get the GitHub and Live Demo buttons
      const buttons = socialButtons.querySelectorAll('.project-social-btn');
      
      buttons.forEach((button, index) => {
        // Add accessibility labels to icon-only buttons
        if (!button.getAttribute('aria-label')) {
          button.setAttribute('aria-label', index === 0 ? 'View source code on GitHub' : 'Open live project');
        }
        // Wrap button in pin container
        this.wrapButtonWithPin(button, index);
      });
    });
  }

  wrapButtonWithPin(button, index) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'project-social-btn-wrapper project-pin-container';
    
    // Insert wrapper before button
    button.parentNode.insertBefore(wrapper, button);
    
    // Move button into wrapper
    wrapper.appendChild(button);
    
    // Create pin perspective element
    const pinPerspective = this.createPinPerspective(button, index);
    wrapper.appendChild(pinPerspective);
    
    // Add hover events
    this.addHoverEvents(wrapper);
  }

  createPinPerspective(button, index) {
    const perspective = document.createElement('div');
    perspective.className = 'project-pin-perspective';
    
    // Get link from button onclick
    const onclickAttr = button.getAttribute('onclick');
    let linkUrl = '#';
    let linkText = index === 0 ? 'View on GitHub' : 'View Live Demo';
    
    if (onclickAttr) {
      const match = onclickAttr.match(/window\.open\('([^']+)'/);
      if (match) {
        linkUrl = match[1];
      }
    }
    
    perspective.innerHTML = `
      <div class="project-pin-inner">
        <div class="project-pin-top">
          <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="project-pin-link">
            <span class="project-pin-text">${linkText}</span>
            <span class="project-pin-gradient"></span>
          </a>
        </div>
        
        <div class="project-pin-base project-pin-transform">
          <div class="project-pin-ripple"></div>
          <div class="project-pin-ripple"></div>
          <div class="project-pin-ripple"></div>
        </div>
        
        <div>
          <div class="project-pin-line blur"></div>
          <div class="project-pin-line"></div>
          <div class="project-pin-dot blur"></div>
          <div class="project-pin-dot small"></div>
        </div>
      </div>
    `;
    
    return perspective;
  }

  addHoverEvents(wrapper) {
    const button = wrapper.querySelector('.project-social-btn');
    const perspective = wrapper.querySelector('.project-pin-perspective');
    
    if (!button || !perspective) return;
    
    // Mouse enter - show pin effect
    wrapper.addEventListener('mouseenter', () => {
      perspective.style.opacity = '1';
    });
    
    // Mouse leave - hide pin effect
    wrapper.addEventListener('mouseleave', () => {
      perspective.style.opacity = '0';
    });
    
    // Prevent button click from triggering when clicking on pin link
    const pinLink = perspective.querySelector('.project-pin-link');
    if (pinLink) {
      pinLink.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }
}

// Initialize the pin effect
new ProjectPinEffect();
