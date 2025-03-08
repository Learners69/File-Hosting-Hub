/**
 * Test script for shortcuts modal responsive behavior
 * This script helps verify the shortcuts modal's appearance and behavior
 * across different screen sizes.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add a test button to the page for easy testing
    const testButton = document.createElement('button');
    testButton.id = 'shortcuts-test-btn';
    testButton.textContent = 'Test Shortcuts Modal';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '999';
    testButton.style.padding = '8px 12px';
    testButton.style.backgroundColor = 'var(--primary-color, #4a6fa5)';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    testButton.style.fontSize = '14px';
    
    // Only show in development mode or with URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('test-mode') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.body.appendChild(testButton);
    }
    
    testButton.addEventListener('click', function() {
        // Show the shortcuts modal
        const helpButton = document.getElementById('keyboard-help-btn');
        if (helpButton) {
            helpButton.click();
        }
        
        // Log current viewport size
        console.log(`Current viewport: ${window.innerWidth}px × ${window.innerHeight}px`);
        
        // Log which responsive mode is active
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            if (window.innerWidth < 768) {
                console.log('Mobile view active');
            } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                console.log('Tablet view active');
            } else {
                console.log('Desktop view active');
            }
        }
    });
    
    // Add viewport size display for testing
    const viewportDisplay = document.createElement('div');
    viewportDisplay.id = 'viewport-size';
    viewportDisplay.style.position = 'fixed';
    viewportDisplay.style.bottom = '50px';
    viewportDisplay.style.right = '10px';
    viewportDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    viewportDisplay.style.color = 'white';
    viewportDisplay.style.padding = '5px 10px';
    viewportDisplay.style.borderRadius = '4px';
    viewportDisplay.style.fontSize = '12px';
    viewportDisplay.style.zIndex = '999';
    
    // Only show in development mode or with URL parameter
    if (urlParams.has('test-mode') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.body.appendChild(viewportDisplay);
        
        // Update viewport size display
        function updateViewportDisplay() {
            viewportDisplay.textContent = `${window.innerWidth}px × ${window.innerHeight}px`;
            
            // Add device type indicator
            if (window.innerWidth < 768) {
                viewportDisplay.textContent += ' (Mobile)';
            } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                viewportDisplay.textContent += ' (Tablet)';
            } else {
                viewportDisplay.textContent += ' (Desktop)';
            }
        }
        
        // Initial update
        updateViewportDisplay();
        
        // Update on resize
        window.addEventListener('resize', updateViewportDisplay);
    }
}); 