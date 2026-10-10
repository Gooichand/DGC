/* Infinite Loop Gallery - Vanilla JS Version */

// Gallery images from your media folder
const galleryImages = [
    'media/m-1.webp',
    'media/m-2.webp',
    'media/m-4.webp',
    'media/m-5.webp',
    'media/m-6.webp',
    'media/m-7.webp',
    'media/m-8.webp',
    'media/m-9.webp',
    'media/m-10.webp',
    'media/m-11.webp',
    'media/m-12.webp',
    'media/m-13.webp',
    'media/m-17.webp',
    'media/m-18.webp',
    'media/m-21.webp',
    'media/m-25.webp',
    'media/m-26.webp',
    'media/1765516026925.webp',
    'media/1765516027844.webp',
    'media/1768754044412.webp',
    'media/screenshot-2025-07-12-145635.webp',
    'media/screenshot-2026-01-09-003412.webp',
    'media/screenshot-2026-01-13-121550.webp',
    'media/screenshot-2026-01-18-212031.webp'
];

function createInfiniteGallery() {
    const gallerySection = document.getElementById('media');
    
    // Clear existing content
    gallerySection.innerHTML = `
        <div class="cyber-matrix"></div>
        <div class="floating-particles"></div>
        <div class="holographic-grid"></div>
        <div class="pixel-storm"></div>
        
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 3rem;">
                <h2 style="font-family: 'Orbitron', monospace; color: var(--forensic-green); font-size: 2.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-photo-video"></i> GALLERY
                </h2>
            </div>
            
            <!-- Infinite Scroll Container -->
            <div class="infinite-gallery-container">
                <div class="infinite-gallery-track" id="galleryTrack">
                    <!-- Images will be inserted here -->
                </div>
            </div>
        </div>
    `;

    // Add CSS styles
    const styles = `
        <style>
        .infinite-gallery-container {
            width: 100%;
            overflow: hidden;
            position: relative;
            background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 50%, transparent 100%);
            padding: 2rem 0;
            mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
            -webkit-mask: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
        }

        .infinite-gallery-track {
            display: flex;
            gap: 1.5rem;
            animation: scrollInfinite 30s linear infinite;
            width: max-content;
        }

        .gallery-image-item {
            flex-shrink: 0;
            width: 250px;
            height: 300px;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            transition: transform 0.3s ease, filter 0.3s ease;
            border: 2px solid var(--forensic-green);
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }

        .gallery-image-item:hover {
            transform: scale(1.05);
            filter: brightness(1.2);
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.6);
        }

        .gallery-image-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .gallery-image-item:hover img {
            transform: scale(1.1);
        }

        @keyframes scrollInfinite {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        @media (max-width: 768px) {
            .gallery-image-item {
                width: 200px;
                height: 250px;
            }
        }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);

    // Create gallery track with duplicated images
    const galleryTrack = document.getElementById('galleryTrack');
    const duplicatedImages = [...galleryImages, ...galleryImages];

    duplicatedImages.forEach((imageSrc, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'gallery-image-item';
        imageItem.innerHTML = `
            <img src="${imageSrc}" alt="Gallery Image ${(index % galleryImages.length) + 1}" loading="lazy">
        `;
        
        // Add click event for modal
        imageItem.addEventListener('click', () => {
            openImageModal(imageSrc);
        });
        
        galleryTrack.appendChild(imageItem);
    });
}

function openImageModal(imageSrc) {
    const modal = document.createElement('div');
    modal.id = 'galleryModal';
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
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <img src="${imageSrc}" style="max-width: 100%; max-height: 100%; border-radius: 15px; box-shadow: 0 0 50px rgba(0, 255, 65, 0.5);">
            <button id="closeGalleryModal" style="position: absolute; top: -50px; right: -50px; background: var(--forensic-red); border: none; color: white; font-size: 2rem; padding: 15px 20px; border-radius: 50%; cursor: pointer; box-shadow: 0 0 20px rgba(255, 0, 64, 0.5);">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal events
    document.getElementById('closeGalleryModal').addEventListener('click', closeGalleryModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGalleryModal();
    });
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', createInfiniteGallery);