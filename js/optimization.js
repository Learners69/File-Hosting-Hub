// Optimization and Testing - Phase 5 Implementation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all optimization features
    initLazyLoading();
    optimizeImageLoading();
    setupPerformanceMonitoring();
    checkBrowserCompatibility();
    enableOfflineCapabilities();
});

/**
 * Lazy Loading Implementation for Link Cards
 * Only loads cards that are visible in the viewport or close to it
 */
function initLazyLoading() {
    // Get all link cards
    const linkCards = document.querySelectorAll('.link-card');
    
    // Set up Intersection Observer
    const options = {
        root: null, // viewport
        rootMargin: '200px', // load cards when they're 200px from viewport
        threshold: 0.1 // trigger when 10% of the card is visible
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Load card content if it was deferred
                if (card.classList.contains('lazy-load')) {
                    // Load any deferred images
                    const lazyImages = card.querySelectorAll('img[data-src]');
                    lazyImages.forEach(img => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    });
                    
                    // Remove lazy-load class to avoid reprocessing
                    card.classList.remove('lazy-load');
                }
                
                // Stop observing this card
                observer.unobserve(card);
            }
        });
    }, options);
    
    // Start observing each card
    linkCards.forEach(card => {
        card.classList.add('lazy-load');
        observer.observe(card);
    });
    
    console.log('Lazy loading initialized for', linkCards.length, 'cards');
}

/**
 * Optimize image loading across the site
 */
function optimizeImageLoading() {
    // Find all images
    const images = document.querySelectorAll('img:not([loading])');
    
    // Add loading="lazy" attribute to images not in viewport
    images.forEach(img => {
        // Skip small icons and logos
        if (img.width < 50 || img.height < 50) return;
        
        // Add native lazy loading
        img.setAttribute('loading', 'lazy');
        
        // Add decoding async for better performance
        img.setAttribute('decoding', 'async');
    });
    
    // Preload critical images
    const criticalImages = document.querySelectorAll('.critical-image');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.dataset.src;
            document.head.appendChild(preloadLink);
        }
    });
}

/**
 * Set up performance monitoring
 */
function setupPerformanceMonitoring() {
    // Only run in development mode or if explicitly enabled
    if (!window.location.href.includes('enable-monitoring') && 
        !localStorage.getItem('enable-performance-monitoring')) {
        return;
    }
    
    // Monitor page load metrics
    window.addEventListener('load', () => {
        // Use Performance API
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const domReadyTime = perfData.domComplete - perfData.domLoading;
            
            console.log('Page load time:', pageLoadTime + 'ms');
            console.log('DOM ready time:', domReadyTime + 'ms');
            
            // Log to localStorage for tracking over time
            const performanceLog = JSON.parse(localStorage.getItem('performance-log') || '[]');
            performanceLog.push({
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                pageLoadTime,
                domReadyTime
            });
            
            // Keep only the last 20 entries
            if (performanceLog.length > 20) {
                performanceLog.shift();
            }
            
            localStorage.setItem('performance-log', JSON.stringify(performanceLog));
        }
    });
    
    // Monitor runtime performance
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let slowFrames = 0;
    
    function checkFrameRate() {
        const now = performance.now();
        const delta = now - lastFrameTime;
        
        frameCount++;
        
        // Check for slow frames (taking more than 50ms, which is less than 20fps)
        if (delta > 50) {
            slowFrames++;
        }
        
        // Log every 60 frames
        if (frameCount >= 60) {
            const slowFramePercentage = (slowFrames / frameCount) * 100;
            if (slowFramePercentage > 5) {
                console.warn(`Performance warning: ${slowFramePercentage.toFixed(1)}% of frames were slow`);
            }
            
            frameCount = 0;
            slowFrames = 0;
        }
        
        lastFrameTime = now;
        requestAnimationFrame(checkFrameRate);
    }
    
    requestAnimationFrame(checkFrameRate);
}

/**
 * Check browser compatibility and show warnings if needed
 */
function checkBrowserCompatibility() {
    const warnings = [];
    
    // Check for IntersectionObserver support (needed for lazy loading)
    if (!('IntersectionObserver' in window)) {
        warnings.push('Your browser does not support IntersectionObserver, which is used for lazy loading. Some features may not work correctly.');
        
        // Fallback for lazy loading
        document.querySelectorAll('.lazy-load').forEach(el => {
            el.classList.remove('lazy-load');
        });
    }
    
    // Check for modern CSS features
    const testEl = document.createElement('div');
    if (!('gridArea' in testEl.style)) {
        warnings.push('Your browser has limited CSS Grid support. The layout may not display correctly.');
    }
    
    // Check for localStorage (needed for theme and preferences)
    if (!('localStorage' in window)) {
        warnings.push('Your browser does not support localStorage. Theme preferences and other settings will not be saved.');
    }
    
    // Display warnings if any
    if (warnings.length > 0) {
        const warningContainer = document.createElement('div');
        warningContainer.className = 'browser-compatibility-warning';
        
        const warningHeader = document.createElement('h3');
        warningHeader.textContent = 'Browser Compatibility Issues';
        warningContainer.appendChild(warningHeader);
        
        const warningList = document.createElement('ul');
        warnings.forEach(warning => {
            const li = document.createElement('li');
            li.textContent = warning;
            warningList.appendChild(li);
        });
        
        warningContainer.appendChild(warningList);
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Dismiss';
        closeButton.addEventListener('click', () => {
            warningContainer.remove();
            localStorage.setItem('dismissed-compatibility-warning', 'true');
        });
        
        warningContainer.appendChild(closeButton);
        
        // Only show if not previously dismissed
        if (localStorage.getItem('dismissed-compatibility-warning') !== 'true') {
            document.body.appendChild(warningContainer);
        }
    }
}

/**
 * Enable basic offline capabilities using service worker if supported
 */
function enableOfflineCapabilities() {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        // Register service worker
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
} 