// Responsive test script for result counter visibility

document.addEventListener('DOMContentLoaded', function() {
    console.log('Responsive test script loaded');
    
    // Get elements
    const searchInput = document.getElementById('search-input');
    let resultCounter = document.querySelector('.result-counter');
    
    // Create result counter if it doesn't exist
    if (!resultCounter) {
        console.log('Creating result counter element for testing');
        resultCounter = document.createElement('div');
        resultCounter.classList.add('result-counter');
        resultCounter.style.display = 'none'; // Initially hidden
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(resultCounter);
            console.log('Result counter added to search container');
        } else {
            console.log('Search container not found');
        }
    }
    
    // Log initial state and screen size
    const screenWidth = window.innerWidth;
    console.log('Initial state:');
    console.log('Screen width:', screenWidth);
    console.log('Search input value:', searchInput ? searchInput.value : 'Element not found');
    console.log('Result counter display:', resultCounter ? getComputedStyle(resultCounter).display : 'Element not found');
    
    // Determine device type based on screen width
    let deviceType = 'unknown';
    if (screenWidth < 768) {
        deviceType = 'mobile';
    } else if (screenWidth >= 768 && screenWidth < 1024) {
        deviceType = 'tablet';
    } else {
        deviceType = 'desktop';
    }
    console.log('Device type:', deviceType);
    
    // Test with search
    if (searchInput && resultCounter) {
        // Test with search input
        console.log('Testing with search input...');
        searchInput.value = 'test';
        
        // Trigger search event
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        searchInput.dispatchEvent(event);
        
        // Check after a delay
        setTimeout(function() {
            console.log('After search:');
            console.log('Search input value:', searchInput.value);
            console.log('Result counter display:', getComputedStyle(resultCounter).display);
            console.log('Result counter text:', resultCounter.textContent);
            
            // Clear search
            console.log('Testing with empty search...');
            searchInput.value = '';
            searchInput.dispatchEvent(event);
            
            // Check after another delay
            setTimeout(function() {
                console.log('After clearing search:');
                console.log('Search input value:', searchInput.value);
                console.log('Result counter display:', getComputedStyle(resultCounter).display);
            }, 500);
        }, 500);
    }
    
    // Add window resize listener to test responsive behavior
    window.addEventListener('resize', function() {
        const newWidth = window.innerWidth;
        console.log('Window resized to width:', newWidth);
        
        // Determine new device type
        let newDeviceType = 'unknown';
        if (newWidth < 768) {
            newDeviceType = 'mobile';
        } else if (newWidth >= 768 && newWidth < 1024) {
            newDeviceType = 'tablet';
        } else {
            newDeviceType = 'desktop';
        }
        console.log('New device type:', newDeviceType);
        
        // Check result counter display after resize
        if (resultCounter) {
            console.log('Result counter display after resize:', getComputedStyle(resultCounter).display);
        }
    });
}); 