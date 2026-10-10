/* Expandable Tabs Navigation - Vanilla JS Version */

const navigationTabs = [
    { title: 'HOME', icon: 'fas fa-home', section: 'home' },
    { title: 'PROFILE', icon: 'fas fa-user-secret', section: 'about' },
    { title: 'EDUCATION', icon: 'fas fa-graduation-cap', section: 'education' },
    { type: 'separator' },
    { title: 'EXPERIENCES', icon: 'fas fa-briefcase', section: 'experiences' },
    { title: 'SKILLS', icon: 'fas fa-cogs', section: 'technical-skills' },
    { title: 'PROJECTS', icon: 'fas fa-project-diagram', section: 'projects' },
    { type: 'separator' },
    { title: 'BADGES', icon: 'fas fa-award', section: 'badges' },
    { title: 'CERTIFICATIONS', icon: 'fas fa-certificate', section: 'certificates' },
    { title: 'GALLERY', icon: 'fas fa-photo-video', section: 'media' },
    { title: 'CONTACT', icon: 'fas fa-satellite-dish', section: 'contact' }
];

function createExpandableNavigation() {
    // Hide existing navigation
    const existingNav = document.querySelector('.forensic-nav');
    if (existingNav) {
        existingNav.style.display = 'none';
    }

    // Create floating bottom navigation
    const floatingNav = document.createElement('div');
    floatingNav.className = 'floating-expandable-nav';
    floatingNav.id = 'floatingNav';

    // Add CSS styles
    const styles = `
        <style>
        .floating-expandable-nav {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 0.5rem;
            box-shadow: 0 8px 32px rgba(0, 255, 65, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            animation: glassFloat 3s ease-in-out infinite;
        }

        @keyframes glassFloat {
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            50% { transform: translateX(-50%) translateY(-5px); }
        }

        .nav-tab {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 0.8rem;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 0.8rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            min-width: 40px;
            text-decoration: none;
            backdrop-filter: blur(10px);
        }

        .nav-tab:hover {
            background: rgba(0, 255, 65, 0.15);
            border-color: rgba(0, 255, 65, 0.3);
            color: var(--forensic-green);
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0, 255, 65, 0.2);
        }

        .nav-tab.active {
            background: rgba(0, 255, 65, 0.2);
            border-color: var(--forensic-green);
            color: var(--forensic-green);
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            min-width: auto;
        }

        .nav-tab-icon {
            font-size: 1rem;
            flex-shrink: 0;
        }

        .nav-tab-text {
            font-family: 'Orbitron', monospace;
            letter-spacing: 0.5px;
            opacity: 1;
            width: auto;
            margin-left: 0.5rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        }

        .compact-labels .nav-tab-text {
            opacity: 0;
            width: 0;
            margin-left: 0;
        }

        .compact-labels .nav-tab.active .nav-tab-text {
            opacity: 1;
            width: auto;
            margin-left: 0.5rem;
        }

        .nav-separator {
            width: 1px;
            height: 24px;
            background: var(--glass-border);
            margin: 0 0.3rem;
        }

        @media (max-width: 768px) {
            .floating-expandable-nav {
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
                max-width: 95vw;
                overflow-x: auto;
                overflow-y: hidden;
                padding: 0.4rem;
                gap: 0.3rem;
                border-radius: 20px;
                scrollbar-width: none;
            }
            
            .floating-expandable-nav::-webkit-scrollbar {
                display: none;
            }
            
            .nav-tab {
                font-size: 0.7rem;
                padding: 0.5rem 0.6rem;
                min-width: 38px;
            }
            
            .nav-tab-icon {
                font-size: 0.9rem;
            }
            
            .nav-separator {
                height: 20px;
            }
        }

        @media (max-width: 480px) {
            .floating-expandable-nav {
                gap: 0.25rem;
                padding: 0.35rem;
                bottom: 8px;
            }
            
            .nav-tab {
                padding: 0.45rem 0.55rem;
                min-width: 36px;
            }
            
            .nav-tab-icon {
                font-size: 0.85rem;
            }
            
            .nav-tab-text {
                font-size: 0.65rem;
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);

    let selectedIndex = null;

    // Create navigation tabs
        navigationTabs.forEach((tab, index) => {
            if (tab.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'nav-separator';
                floatingNav.appendChild(separator);
                return;
            }

            const tabElement = document.createElement('a');
            tabElement.className = 'nav-tab';
            tabElement.href = `#${tab.section}`;
tabElement.title = tab.title;
            tabElement.setAttribute('aria-label', `Go to ${tab.title}`);
            tabElement.innerHTML = `
                <i class="${tab.icon} nav-tab-icon"></i>
                <span class="nav-tab-text">${tab.title}</span>
            `;

            // Add click event
            tabElement.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tabElement.classList.add('active');
                tabElement.setAttribute('aria-current', 'page');
                selectedIndex = index;
                
                // Smooth scroll to section
                const targetSection = document.getElementById(tab.section);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            floatingNav.appendChild(tabElement);
        });

    // Add to body instead of nav container
    document.body.appendChild(floatingNav);

    // Labels always visible on real desktops; compact icons on phones
    if (window.screen.width <= 900) {
        floatingNav.classList.add('compact-labels');
    }

    // Handle scroll-based active state
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navTabs = document.querySelectorAll('.nav-tab');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.removeAttribute('aria-current');
            const href = tab.getAttribute('href');
            if (href === `#${current}`) {
                tab.classList.add('active');
                tab.setAttribute('aria-current', 'page');
            }
        });
    });

    // Click outside to collapse
    document.addEventListener('click', (e) => {
        if (!floatingNav.contains(e.target)) {
            document.querySelectorAll('.nav-tab').forEach(tab => {
                if (!tab.classList.contains('active')) {
                    // Keep only active tab expanded
                }
            });
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', createExpandableNavigation);