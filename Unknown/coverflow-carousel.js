// 3D Coverflow Carousel with Auto-Loop
class CoverflowCarousel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: options.autoplay !== false,
            autoplayDelay: options.autoplayDelay || 1000,
            loop: options.loop !== false,
            showPagination: options.showPagination !== false,
            showNavigation: options.showNavigation !== false,
            ...options
        };
        
        this.currentIndex = 0;
        this.slides = [];
        this.autoplayTimer = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.createCarousel();
        this.setupEventListeners();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    createCarousel() {
        const carouselHTML = `
            <div class="coverflow-carousel">
            </div>
        `;
        
        this.container.innerHTML = carouselHTML;
        this.carousel = this.container.querySelector('.coverflow-carousel');
        
        this.loadSlides();
    }
    
    loadSlides() {
        // Get all gallery items
        const galleryItems = document.querySelectorAll('#masonryGallery .gallery-item');
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const video = item.querySelector('video');
            const category = item.dataset.category;
            
            const slide = document.createElement('div');
            slide.className = 'coverflow-slide';
            slide.dataset.index = index;
            
            if (video) {
                const videoClone = video.cloneNode(true);
                videoClone.setAttribute('controls', '');
                videoClone.setAttribute('playsinline', '');
                videoClone.setAttribute('preload', 'metadata');
                videoClone.style.cssText = 'background:#000;width:100%;height:100%;object-fit:cover;border-radius:12px;';
                slide.appendChild(videoClone);
            } else if (img) {
                const imgClone = img.cloneNode(true);
                // Keep off-screen carousel clones lazy; updateSlides promotes only nearby slides.
                imgClone.loading = 'lazy';
                imgClone.decoding = 'async';
                imgClone.dataset.fullResolutionSrc = img.getAttribute('src') || '';
                imgClone.dataset.responsiveSrcset = img.getAttribute('srcset') || '';
                imgClone.dataset.responsiveSizes = img.getAttribute('sizes') || '';
                imgClone.removeAttribute('aria-hidden');
                slide.appendChild(imgClone);
            }
            
            this.carousel.appendChild(slide);
            this.slides.push(slide);
        });
        
        this.updateSlides();

        const sourceGallery = document.getElementById('masonryGallery');
        const hasRenderableSlide = this.slides.some((slide) => slide.querySelector('img, video'));
        if (sourceGallery && hasRenderableSlide) {
            sourceGallery.classList.add('is-enhanced');
        }
    }

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev-1', 'prev-2', 'next-1', 'next-2', 'hidden');
            
            const diff = index - this.currentIndex;
            const loopDistance = Math.min(Math.abs(diff), this.slides.length - Math.abs(diff));
            const slideImage = slide.querySelector('img');
            if (slideImage) {
                const fullResolutionSrc = slideImage.dataset.fullResolutionSrc;
                const responsiveSrcset = slideImage.dataset.responsiveSrcset;
                const responsiveSizes = slideImage.dataset.responsiveSizes;
                // Lazy even for the crisp centre set: Chrome re-evaluates viewport
                // distance whenever src/srcset changes, so the full-resolution swap
                // below is deferred until the visitor scrolls near the carousel.
                const isVisibleSlide = loopDistance <= 2;

                slideImage.loading = 'lazy';
                slideImage.fetchPriority = loopDistance === 0 ? 'high' : 'low';

                if (fullResolutionSrc && isVisibleSlide) {
                    // The visible coverflow cards are enlarged by 3D transforms; keep them crisp.
                    slideImage.removeAttribute('srcset');
                    slideImage.removeAttribute('sizes');
                    if (slideImage.getAttribute('src') !== fullResolutionSrc) {
                        slideImage.setAttribute('src', fullResolutionSrc);
                    }
                } else if (responsiveSrcset) {
                    slideImage.setAttribute('srcset', responsiveSrcset);
                    if (responsiveSizes) slideImage.setAttribute('sizes', responsiveSizes);
                }
            }
            
            if (diff === 0) {
                slide.classList.add('active');
            } else if (diff === -1 || (diff === this.slides.length - 1 && this.options.loop)) {
                slide.classList.add('prev-1');
            } else if (diff === -2 || (diff === this.slides.length - 2 && this.options.loop)) {
                slide.classList.add('prev-2');
            } else if (diff === 1 || (diff === -(this.slides.length - 1) && this.options.loop)) {
                slide.classList.add('next-1');
            } else if (diff === 2 || (diff === -(this.slides.length - 2) && this.options.loop)) {
                slide.classList.add('next-2');
            } else {
                slide.classList.add('hidden');
            }
        });
    }
    
    next() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        } else if (this.options.loop) {
            this.currentIndex = 0;
        }
        
        this.updateSlides();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    prev() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else if (this.options.loop) {
            this.currentIndex = this.slides.length - 1;
        }
        
        this.updateSlides();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    goTo(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateSlides();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
        
        this.resetAutoplay();
    }
    
    startAutoplay() {
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, this.options.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    resetAutoplay() {
        if (this.options.autoplay) {
            this.stopAutoplay();
            this.startAutoplay();
        }
    }
    
    setupEventListeners() {
        // Slide click
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                if (index !== this.currentIndex) {
                    this.goTo(index);
                }
            });
        });
        
        // Pause on hover - REMOVED to keep continuous loop
        // Keyboard navigation - REMOVED to keep continuous loop
    }
    
    destroy() {
        this.stopAutoplay();
        this.container.innerHTML = '';
    }
}

// The file is loaded by the portfolio's idle-time loader, after DOMContentLoaded may have fired.
function initCoverflowGallery() {
    const carouselContainer = document.querySelector('.coverflow-carousel-container');
    if (!carouselContainer || carouselContainer.dataset.coverflowReady === 'true') return;

    carouselContainer.dataset.coverflowReady = 'true';
    new CoverflowCarousel(carouselContainer, {
        autoplay: true,
        autoplayDelay: 1000,
        loop: true,
        showNavigation: false
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCoverflowGallery, { once: true });
} else {
    initCoverflowGallery();
}
