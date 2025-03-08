/**
 * Performance Testing Script
 * Used to test website performance across different devices and browsers
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run in test mode
    if (!window.location.href.includes('performance-test')) {
        return;
    }
    
    // Create performance monitor UI
    createPerformanceMonitor();
    
    // Run tests
    runPerformanceTests();
});

/**
 * Create a visual performance monitor
 */
function createPerformanceMonitor() {
    const monitor = document.createElement('div');
    monitor.className = 'performance-monitor visible';
    monitor.innerHTML = `
        <div>FPS: <span class="fps">0</span></div>
        <div>Memory: <span class="memory">0 MB</span></div>
        <div>DOM Nodes: <span class="dom-nodes">0</span></div>
        <div>Link Cards: <span class="link-cards">0</span></div>
    `;
    document.body.appendChild(monitor);
    
    // Update FPS counter
    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 0;
    
    function updateFPS() {
        frameCount++;
        const now = performance.now();
        
        // Update every second
        if (now - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (now - lastTime));
            
            const fpsElement = monitor.querySelector('.fps');
            fpsElement.textContent = fps;
            
            // Color code based on performance
            fpsElement.className = 'fps';
            if (fps >= 50) {
                fpsElement.classList.add('good');
            } else if (fps >= 30) {
                fpsElement.classList.add('warning');
            } else {
                fpsElement.classList.add('bad');
            }
            
            // Reset counters
            frameCount = 0;
            lastTime = now;
            
            // Update other stats
            updateMemoryUsage();
            updateDOMStats();
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    requestAnimationFrame(updateFPS);
}

/**
 * Update memory usage stats if available
 */
function updateMemoryUsage() {
    const memoryElement = document.querySelector('.performance-monitor .memory');
    
    if (performance.memory) {
        const usedHeapSize = performance.memory.usedJSHeapSize;
        const mbUsed = Math.round(usedHeapSize / (1024 * 1024));
        memoryElement.textContent = `${mbUsed} MB`;
        
        // Warn if memory usage is high
        if (mbUsed > 100) {
            memoryElement.style.color = '#e74c3c';
        } else {
            memoryElement.style.color = '';
        }
    } else {
        memoryElement.textContent = 'Not available';
    }
}

/**
 * Update DOM statistics
 */
function updateDOMStats() {
    const domNodesElement = document.querySelector('.performance-monitor .dom-nodes');
    const linkCardsElement = document.querySelector('.performance-monitor .link-cards');
    
    // Count DOM nodes
    const nodeCount = document.querySelectorAll('*').length;
    domNodesElement.textContent = nodeCount;
    
    // Count link cards
    const linkCardCount = document.querySelectorAll('.link-card').length;
    linkCardsElement.textContent = linkCardCount;
    
    // Warn if DOM is getting large
    if (nodeCount > 1500) {
        domNodesElement.style.color = '#e74c3c';
    } else if (nodeCount > 1000) {
        domNodesElement.style.color = '#f39c12';
    } else {
        domNodesElement.style.color = '';
    }
}

/**
 * Run a series of performance tests
 */
function runPerformanceTests() {
    console.log('Starting performance tests...');
    
    // Test 1: Page load time
    const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page load time: ${pageLoadTime}ms`);
    
    // Test 2: DOM Content Loaded time
    const domContentLoadedTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log(`DOM Content Loaded time: ${domContentLoadedTime}ms`);
    
    // Test 3: First Paint time (if available)
    if (performance.getEntriesByType) {
        const paintMetrics = performance.getEntriesByType('paint');
        if (paintMetrics.length > 0) {
            const firstPaint = paintMetrics.find(entry => entry.name === 'first-paint');
            if (firstPaint) {
                console.log(`First Paint time: ${firstPaint.startTime}ms`);
            }
            
            const firstContentfulPaint = paintMetrics.find(entry => entry.name === 'first-contentful-paint');
            if (firstContentfulPaint) {
                console.log(`First Contentful Paint time: ${firstContentfulPaint.startTime}ms`);
            }
        }
    }
    
    // Test 4: Resource loading
    if (performance.getEntriesByType) {
        const resourceEntries = performance.getEntriesByType('resource');
        
        // Group by resource type
        const resourcesByType = {};
        let totalResourceSize = 0;
        
        resourceEntries.forEach(resource => {
            const type = resource.initiatorType || 'other';
            
            if (!resourcesByType[type]) {
                resourcesByType[type] = {
                    count: 0,
                    size: 0,
                    totalDuration: 0
                };
            }
            
            resourcesByType[type].count++;
            
            // Some resources may not have transferSize property
            if (resource.transferSize) {
                resourcesByType[type].size += resource.transferSize;
                totalResourceSize += resource.transferSize;
            }
            
            resourcesByType[type].totalDuration += resource.duration;
        });
        
        console.log('Resource loading by type:');
        console.table(resourcesByType);
        console.log(`Total resource size: ${Math.round(totalResourceSize / 1024)} KB`);
    }
    
    // Test 5: Search performance
    testSearchPerformance();
    
    // Test 6: Scroll performance
    testScrollPerformance();
    
    // Test 7: Browser features
    testBrowserFeatures();
}

/**
 * Test search performance
 */
function testSearchPerformance() {
    console.log('Testing search performance...');
    
    const searchInput = document.getElementById('search-input');
    if (!searchInput) {
        console.log('Search input not found, skipping test');
        return;
    }
    
    // Sample search terms of increasing complexity
    const searchTerms = [
        'a', // Single character
        'pdf', // Common term
        'document 2023', // Multiple terms
        'important meeting notes from january', // Long query
        'tag:important date:2023' // Advanced search
    ];
    
    searchTerms.forEach(term => {
        // Measure search time
        console.log(`Testing search for: "${term}"`);
        
        // Set the search term
        searchInput.value = term;
        
        // Create and dispatch an input event
        const inputEvent = new Event('input', { bubbles: true });
        
        const startTime = performance.now();
        searchInput.dispatchEvent(inputEvent);
        
        // Use setTimeout to measure after search completes
        setTimeout(() => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            console.log(`Search for "${term}" took ${duration.toFixed(2)}ms`);
            
            // Count visible results
            const visibleResults = document.querySelectorAll('.link-card[style*="display: flex"]').length;
            console.log(`Found ${visibleResults} results`);
        }, 500); // Wait for search to complete
    });
}

/**
 * Test scroll performance
 */
function testScrollPerformance() {
    console.log('Testing scroll performance...');
    
    // Create a scroll test button
    const scrollTestButton = document.createElement('button');
    scrollTestButton.textContent = 'Run Scroll Test';
    scrollTestButton.style.position = 'fixed';
    scrollTestButton.style.bottom = '20px';
    scrollTestButton.style.left = '20px';
    scrollTestButton.style.zIndex = '9999';
    scrollTestButton.style.padding = '10px';
    
    scrollTestButton.addEventListener('click', () => {
        // Scroll to top first
        window.scrollTo(0, 0);
        
        // Wait a bit then start the test
        setTimeout(() => {
            const totalHeight = document.body.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollSteps = 20; // Number of steps to scroll
            const stepSize = (totalHeight - viewportHeight) / scrollSteps;
            
            let currentStep = 0;
            let totalFrameDrop = 0;
            let lastTimestamp = performance.now();
            
            function scrollStep(timestamp) {
                // Calculate frame time
                const frameTime = timestamp - lastTimestamp;
                lastTimestamp = timestamp;
                
                // Check for dropped frames (assuming 60fps target)
                if (frameTime > 20) { // More than 50fps
                    const droppedFrames = Math.floor(frameTime / 16.67) - 1;
                    totalFrameDrop += droppedFrames;
                }
                
                // Scroll to next position
                currentStep++;
                window.scrollTo(0, currentStep * stepSize);
                
                // Continue until done
                if (currentStep < scrollSteps) {
                    requestAnimationFrame(scrollStep);
                } else {
                    // Test complete
                    console.log(`Scroll test complete. Dropped approximately ${totalFrameDrop} frames.`);
                    
                    // Calculate jank percentage
                    const jankPercentage = (totalFrameDrop / scrollSteps) * 100;
                    console.log(`Scroll jank: ${jankPercentage.toFixed(1)}%`);
                    
                    if (jankPercentage > 20) {
                        console.warn('Scroll performance is poor. Consider optimizing.');
                    } else if (jankPercentage > 5) {
                        console.log('Scroll performance is acceptable but could be improved.');
                    } else {
                        console.log('Scroll performance is good.');
                    }
                }
            }
            
            requestAnimationFrame(scrollStep);
        }, 500);
    });
    
    document.body.appendChild(scrollTestButton);
}

/**
 * Test browser features and compatibility
 */
function testBrowserFeatures() {
    console.log('Testing browser features and compatibility...');
    
    const features = {
        'IntersectionObserver': 'IntersectionObserver' in window,
        'ResizeObserver': 'ResizeObserver' in window,
        'ServiceWorker': 'serviceWorker' in navigator,
        'localStorage': 'localStorage' in window,
        'sessionStorage': 'sessionStorage' in window,
        'CSS Grid': CSS.supports('display', 'grid'),
        'CSS Flexbox': CSS.supports('display', 'flex'),
        'CSS Variables': CSS.supports('--test', '0'),
        'Fetch API': 'fetch' in window,
        'Promise': 'Promise' in window,
        'WebP Support': false // Will test separately
    };
    
    // Test WebP support
    const webpTest = new Image();
    webpTest.onload = function() {
        features['WebP Support'] = true;
        console.table(features);
    };
    webpTest.onerror = function() {
        features['WebP Support'] = false;
        console.table(features);
    };
    webpTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    
    // Log browser info
    console.log('Browser Information:');
    console.log(`User Agent: ${navigator.userAgent}`);
    console.log(`Platform: ${navigator.platform}`);
    console.log(`Screen Resolution: ${window.screen.width}x${window.screen.height}`);
    console.log(`Device Pixel Ratio: ${window.devicePixelRatio}`);
    console.log(`Viewport Size: ${window.innerWidth}x${window.innerHeight}`);
} 