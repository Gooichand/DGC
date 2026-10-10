/* Hero Announcement Pill - Vanilla JS Version */

function createAnnouncementPill() {
    const homeSection = document.getElementById('home');
    const heroContent = homeSection.querySelector('div[style*="position: relative; z-index: 10"]');
    
    // Create announcement pill (starts with SECURE, cycles through rotation)
    const announcementPill = document.createElement('div');
    announcementPill.className = 'hero-announcement-pill';
    announcementPill.innerHTML = `
        <a href="#about" class="announcement-link">
            <div class="announcement-badge">
                <i class="fas fa-shield-alt"></i> SECURE
            </div>
            <span class="announcement-text">Advanced Cybersecurity Portfolio - Explore Now</span>
            <i class="fas fa-arrow-right announcement-arrow"></i>
        </a>
    `;

    // Add CSS styles
    const styles = `
        <style>
        .hero-announcement-pill {
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
            animation: pillSlideIn 0.8s ease-out;
        }

        .announcement-link {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            max-width: 100%;
            min-width: 0;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 50px;
            padding: 0.6rem 1.2rem;
            text-decoration: none;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            box-shadow: 0 0 40px rgba(0, 255, 65, 0.06), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
            position: relative;
            overflow: hidden;
        }

        .announcement-link::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50px;
            background: linear-gradient(
                105deg,
                transparent 30%,
                rgba(255, 255, 255, 0.06) 35%,
                rgba(255, 255, 255, 0.12) 42%,
                rgba(255, 255, 255, 0.06) 49%,
                transparent 54%
            );
            background-size: 250% 100%;
            animation: shineSweep 5s ease-in-out infinite;
            pointer-events: none;
            transition: opacity 0.3s ease, animation-duration 0.3s ease;
        }

        .announcement-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 60px rgba(0, 255, 65, 0.12), 0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .announcement-link:hover::before {
            background: linear-gradient(
                105deg,
                transparent 25%,
                rgba(255, 255, 255, 0.1) 30%,
                rgba(255, 255, 255, 0.2) 38%,
                rgba(255, 255, 255, 0.1) 46%,
                transparent 52%
            );
            animation-duration: 2.5s;
        }

        .announcement-badge {
            background: linear-gradient(135deg, #00ff41, #00cc33);
            color: black;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: bold;
            font-family: 'Orbitron', monospace;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            letter-spacing: 1px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
            flex-shrink: 0;
        }

        .announcement-text {
            color: rgba(255, 255, 255, 0.88);
            font-size: 0.9rem;
            font-weight: 400;
            font-family: 'JetBrains Mono', monospace;
            white-space: nowrap;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: 0.5px;
        }

        .announcement-arrow {
            color: rgba(255, 255, 255, 0.45);
            font-size: 0.8rem;
            transition: transform 0.3s ease, color 0.3s ease;
        }

        .announcement-link:hover .announcement-arrow {
            transform: translateX(4px);
            color: rgba(255, 255, 255, 0.7);
        }

        @keyframes pillSlideIn {
            0% {
                opacity: 0;
                transform: translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes shineSweep {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }

        @media (max-width: 768px) {
            .announcement-link {
                padding: 0.5rem 1rem;
                gap: 0.6rem;
            }
            
            .announcement-text {
                font-size: 0.8rem;
            }
            
            .announcement-badge {
                font-size: 0.6rem;
                padding: 0.2rem 0.6rem;
            }
        }

        @media (max-width: 480px) {
            .announcement-text {
                display: none;
            }
            
            .announcement-link {
                padding: 0.4rem 0.8rem;
            }
            
            .announcement-badge {
                font-size: 0.65rem;
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);

    // Insert announcement pill before the hero name
    const heroName = heroContent.querySelector('.hero-name');
    heroContent.insertBefore(announcementPill, heroName);

}

// Alternative announcement pills for variety
function createAlternativeAnnouncements() {
    const announcements = [
        {
            badge: { icon: 'fas fa-shield-alt', text: 'SECURE' },
            text: 'Advanced Cybersecurity Portfolio - Explore Now',
            link: '#certificates'
        },
        {
            badge: { icon: 'fas fa-shield-alt', text: 'INTERNSHIP' },
            text: 'Completed Internship | Selected for APCSIP-2026, Amroha Police Cyber Security Program',
            link: '#experiences'
        },
        {
            badge: { icon: 'fas fa-graduation-cap', text: 'STUDENT' },
            text: 'Currently Studying Cybersecurity & Digital Forensics',
            link: '#education'
        }
    ];

    // Rotate announcements every 10 seconds (start from 1 — initial pill shows SECURE)
    let currentIndex = 1;
    setInterval(() => {
        const pill = document.querySelector('.hero-announcement-pill');
        if (pill) {
            const announcement = announcements[currentIndex];
            const link = pill.querySelector('.announcement-link');
            
            link.querySelector('.announcement-badge').innerHTML = `
                <i class="${announcement.badge.icon}"></i> ${announcement.badge.text}
            `;
            link.querySelector('.announcement-text').textContent = announcement.text;
            
            currentIndex = (currentIndex + 1) % announcements.length;
        }
    }, 10000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createAnnouncementPill();
    createAlternativeAnnouncements();
});