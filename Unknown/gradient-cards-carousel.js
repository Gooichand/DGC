/* Gradient Border Cards & 3D Badge Carousel - Vanilla JS Version */

function createGradientBorderCards() {
    // Add CSS for gradient border cards
    const gradientStyles = `
        <style>
        .gradient-border-card {
            position: relative;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 2px solid transparent;
            border-radius: 16px;
            background-clip: padding-box;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .gradient-border-card::before {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: conic-gradient(
                from var(--border-angle, 0deg),
                rgba(100, 116, 139, 0.48) 80%,
                #6366f1 86%,
                #a5b4fc 90%,
                #6366f1 94%,
                rgba(100, 116, 139, 0.48)
            );
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            -webkit-mask-composite: xor;
            animation: borderRotate 8s linear infinite;
        }

        @keyframes borderRotate {
            0% { --border-angle: 0deg; }
            100% { --border-angle: 360deg; }
        }

        @property --border-angle {
            syntax: '<angle>';
            inherits: true;
            initial-value: 0deg;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', gradientStyles);
}

function create3DBadgeCarousel() {
    const badgesSection = document.getElementById('badges');
    const badgeImages = [
        'badges/google.webp',
        'badges/Postman - Postman API Fundamentals Student Expert - 2025-06-17.webp',
        'badges/level 1.webp',
        'badges/google dmdm.webp',
        'badges/starstruck-default--light-a594e2a027e0.webp',
        'badges/blob.webp',
        'badges/blob (1).webp',
        'badges/blob (2).webp',
        'badges/cka_from_cncfsite__281_29.webp'
    ];

    // Clear existing content
    badgesSection.innerHTML = `
        <div class="cyber-matrix"></div>
        <div class="floating-particles"></div>
        <div class="holographic-grid"></div>
        <div class="energy-field"></div>
        <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="font-family: 'Orbitron', monospace; color: var(--forensic-green); text-align: center; margin-bottom: 4rem; font-size: 1.8rem;">
                <i class="fas fa-award"></i> DIGITAL BADGES
            </h2>
            <div class="badge-carousel-container">
                <div class="badge-carousel" id="badgeCarousel">
                    <!-- Badges will be inserted here -->
                </div>
            </div>
        </div>
    `;

    // Add CSS for 3D carousel
    const carouselStyles = `
        <style>
        .badge-carousel-container {
            height: 500px;
            perspective: 1000px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: visible;
            margin: 2rem 0;
        }

        .badge-carousel {
            position: relative;
            width: 450px;
            height: 450px;
            transform-style: preserve-3d;
            animation: rotateCarousel 15s linear infinite;
            cursor: grab;
        }

        .badge-carousel:hover {
            animation-play-state: paused;
        }

        .badge-carousel.dragging {
            cursor: grabbing;
            animation-play-state: paused;
        }

        .badge-item {
            position: absolute;
            width: 140px;
            height: 140px;
            background: var(--bg-glass);
            border: 2px solid var(--forensic-green);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .badge-item:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.6);
            border-color: var(--forensic-cyan);
        }

        .badge-item img {
            width: 90px;
            height: 90px;
            object-fit: contain;
            border-radius: 10px;
            filter: brightness(1.1);
        }

        @keyframes rotateCarousel {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
        }

        @media (max-width: 768px) {
            .badge-carousel-container {
                height: 300px;
            }
            
            .badge-carousel {
                width: 250px;
                height: 250px;
            }
            
            .badge-item {
                width: 100px;
                height: 100px;
            }
            
            .badge-item img {
                width: 70px;
                height: 70px;
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', carouselStyles);

    // Create carousel items
    const carousel = document.getElementById('badgeCarousel');
    const radius = 200;
    const angleStep = 360 / badgeImages.length;

    badgeImages.forEach((imageSrc, index) => {
        const badgeItem = document.createElement('div');
        badgeItem.className = 'badge-item';
        badgeItem.innerHTML = `<img src="${imageSrc}" alt="Badge ${index + 1}" loading="lazy">`;
        
        const angle = index * angleStep;
        const x = Math.sin(angle * Math.PI / 180) * radius;
        const z = Math.cos(angle * Math.PI / 180) * radius;
        
        badgeItem.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-angle}deg)`;
        
        // Add click event for modal
        badgeItem.addEventListener('click', () => {
            openBadgeModal(imageSrc);
        });
        
        carousel.appendChild(badgeItem);
    });

    // Add drag functionality
    let isDragging = false;
    let startX = 0;
    let currentRotation = 0;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        carousel.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        currentRotation += deltaX * 0.5;
        carousel.style.transform = `rotateY(${currentRotation}deg)`;
        startX = e.clientX;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        carousel.classList.remove('dragging');
    });
}

function openBadgeModal(imageSrc) {
    const modal = document.createElement('div');
    modal.id = 'badgeModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; max-width: 80%; max-height: 80%;">
            <img src="${imageSrc}" style="max-width: 100%; max-height: 100%; border-radius: 15px; box-shadow: 0 0 50px rgba(0, 255, 65, 0.5);">
            <button id="closeBadgeModal" style="position: absolute; top: -50px; right: -50px; background: var(--forensic-red); border: none; color: white; font-size: 2rem; padding: 15px 20px; border-radius: 50%; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    document.getElementById('closeBadgeModal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGradientBorderCards();
    create3DBadgeCarousel();
});