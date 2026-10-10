// 3D Experience Cards JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.experience-notification');
    
    cards.forEach(card => {
        let isMouseEntered = false;
        card.style.transformStyle = 'preserve-3d';
        
        card.addEventListener('mouseenter', function() {
            isMouseEntered = true;
        });
        
        card.addEventListener('mousemove', function(e) {
            if (!isMouseEntered) return;
            
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 25;
            const y = (e.clientY - rect.top - rect.height / 2) / 25;
            
            card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
            
            // Animate child items
            const items = card.querySelectorAll('.experience-3d-item');
            items.forEach(item => {
                const translateZ = item.getAttribute('data-translate-z') || 0;
                const translateX = item.getAttribute('data-translate-x') || 0;
                const translateY = item.getAttribute('data-translate-y') || 0;
                const rotateX = item.getAttribute('data-rotate-x') || 0;
                const rotateY = item.getAttribute('data-rotate-y') || 0;
                const rotateZ = item.getAttribute('data-rotate-z') || 0;
                
                item.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
            });
        });
        
        card.addEventListener('mouseleave', function() {
            isMouseEntered = false;
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
            
            // Reset child items
            const items = card.querySelectorAll('.experience-3d-item');
            items.forEach(item => {
                item.style.transform = 'translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
            });
        });
    });
});

