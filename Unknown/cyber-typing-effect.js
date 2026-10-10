/**
 * Cyber Typing Effect Implementation
 * Features:
 * - Live notifications analysis with typing effect
 * - Cyber typing effect with matrix overlay
 * - Progress indicator showing typing completion percentage
 * - Dynamic text rotation showing multiple descriptions
 * - Interactive elements - description selectable after typing completes
 */

// ================== CYBER TYPING EFFECT SYSTEM ==================

class CyberTypingEffect {
    constructor(options = {}) {
        this.textElement = document.getElementById(options.textElementId || 'cyber-paragraph-text');
        this.finalDescription = document.getElementById(options.finalDescriptionId || 'cyber-final-description');
        this.binaryOverlay = document.getElementById(options.binaryOverlayId || 'cyber-binary-overlay');
        this.progressContainer = document.getElementById(options.progressContainerId || 'cyber-progress-container');
        this.progressBar = document.getElementById(options.progressBarId || 'cyber-progress-bar');
        this.progressText = document.getElementById(options.progressTextId || 'cyber-progress-text');
        this.rotationContainer = null;
        
        this.rotationItems = [];
        this.currentRotationIndex = 0;
        this.typingSpeed = options.typingSpeed || 50;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.setupClickToRead();
    }
    
    setupClickToRead() {
        // Make the description selectable after typing completes
        const setupSelection = () => {
            if (this.textElement) {
                this.textElement.style.cursor = 'text';
                this.textElement.style.userSelect = 'text';
                this.textElement.style.webkitUserSelect = 'text';
                this.textElement.style.mozUserSelect = 'text';
            }
        };
        
        if (this.progressContainer) {
            this.progressContainer.addEventListener('animationend', setupSelection, { once: true });
        } else {
            setTimeout(setupSelection, 2000);
        }
    }
    
    // Generate random binary characters for the matrix overlay
    createBinaryCharacter() {
        if (!this.binaryOverlay) return null;
        
        const binaryChar = document.createElement('div');
        binaryChar.className = 'cyber-binary-char';
        binaryChar.textContent = Math.random() > 0.5 ? '1' : '0';
        
        // Random positioning
        binaryChar.style.left = Math.random() * 100 + '%';
        binaryChar.style.top = '-20px';
        binaryChar.style.animationDuration = (Math.random() * 2 + 1) + 's';
        binaryChar.style.animationDelay = Math.random() * 0.5 + 's';
        
        this.binaryOverlay.appendChild(binaryChar);
        
        // Remove after animation completes
        setTimeout(() => {
            if (binaryChar.parentNode) {
                binaryChar.parentNode.removeChild(binaryChar);
            }
        }, 3000);
        
        return binaryChar;
    }
    
    startMatrixOverlay() {
        if (!this.binaryOverlay) return;
        
        // Create binary particles
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            this.createBinaryCharacter();
        }
        
        // Continue creating particles
        this.binaryInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                this.createBinaryCharacter();
            }
        }, 100);
    }
    
    stopMatrixOverlay() {
        if (this.binaryInterval) {
            clearInterval(this.binaryInterval);
            this.binaryInterval = null;
        }
    }
    
    // Typing animation for GENETIC ANALYSIS section
    typeText(text) {
        if (!this.textElement) return;
        
        this.isTyping = true;
        
        // Start matrix overlay
        this.startMatrixOverlay();
        
        // Progress container intentionally not shown
        
        // Clear previous content
        this.textElement.textContent = '';
        
        let currentIndex = 0;
        const totalChars = text.length;
        const textArray = text.split('');
        
        const typeNextChar = () => {
            if (currentIndex < textArray.length) {
                // Check if we should insert binary character
                if (Math.random() > 0.85) {
                    this.createBinaryCharacter();
                }
                
                // Add next character
                this.textElement.textContent += textArray[currentIndex];
                currentIndex++;
                

                
                // Random typing speed for realism
                const randomSpeed = this.typingSpeed * (0.5 + Math.random());
                
                setTimeout(typeNextChar, randomSpeed);
            } else {
                this.finishTyping();
            }
        };
        
        typeNextChar();
    }
    
    finishTyping() {
        this.isTyping = false;
        this.stopMatrixOverlay();
        
        
        // Hide caret
        const carets = document.querySelectorAll('.cyber-caret');
        carets.forEach(caret => caret.style.opacity = '0');
        
        // Keep only the typed text in cyber-paragraph-text
        // cyber-final-description will remain hidden (display: none)
        // to avoid duplicate paragraphs
    }
}

// ================== TYPED.JS CONFIGURATION ==================

function initHomeTypewriter() {
    const typedElement = document.getElementById('typewriter');
    
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed(typedElement, {
            strings: [
                'Cybersecurity Student',
                'Digital Forensics Enthusiast',
                'Future Security Analyst'
            ],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '_'
        });
    }
}

// ================== DOM CONTENT LOADED INITIALIZATION ==================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize home section typewriter
    initHomeTypewriter();
    
    // Initialize cyber typing effect for about section
    setTimeout(() => {
        const cyberTyping = new CyberTypingEffect({
            textElementId: 'cyber-paragraph-text',
            finalDescriptionId: 'cyber-final-description',
            binaryOverlayId: 'cyber-binary-overlay',
            progressContainerId: 'cyber-progress-container',
            progressBarId: 'cyber-progress-bar',
            progressTextId: 'cyber-progress-text',
            rotationContainerId: null,
            typingSpeed: 40
        });
        
        // Start typing the description
        const descriptionText = document.getElementById('cyber-paragraph-text');
        if (descriptionText && !descriptionText.textContent) {
            const description = document.getElementById('cyber-final-description');
            if (description) {
                // Use the text from cyber-final-description as the source
                // but don't show it - just type it into cyber-paragraph-text
                cyberTyping.typeText(description.textContent);
            }
        }
    }, 800);
});
