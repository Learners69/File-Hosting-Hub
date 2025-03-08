// Animations and transitions for UI enhancement

document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to link cards
    const linkCards = document.querySelectorAll('.link-card');
    
    // Apply staggered animation to cards
    linkCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
        card.classList.add('animate-in');
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects to buttons and cards
    const interactiveElements = document.querySelectorAll('button, .link-card, .tag-filter');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
    
    // Add loading animation for search results
    const searchButton = document.getElementById('search-btn');
    const linkGrid = document.querySelector('.link-grid');
    
    if (searchButton && linkGrid) {
        searchButton.addEventListener('click', function() {
            linkGrid.classList.add('loading');
            
            // Remove loading class after search completes (simulated delay)
            setTimeout(() => {
                linkGrid.classList.remove('loading');
            }, 500);
        });
    }
    
    // Add page transition effects
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't apply to current page links
            if (this.classList.contains('active')) return;
            
            // Add exit animation to body
            document.body.classList.add('page-transition-out');
            
            // Store the href
            const href = this.getAttribute('href');
            
            // Delay navigation to allow for animation
            e.preventDefault();
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
    
    // Add entrance animation when page loads
    document.body.classList.add('page-transition-in');
    
    // Remove entrance animation class after animation completes
    setTimeout(() => {
        document.body.classList.remove('page-transition-in');
    }, 500);
}); 