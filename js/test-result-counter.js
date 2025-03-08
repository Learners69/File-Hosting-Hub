// Test script for result counter visibility

document.addEventListener('DOMContentLoaded', function() {
    console.log('Test script loaded');
    
    // Get elements
    const searchInput = document.getElementById('search-input');
    let resultCounter = document.querySelector('.result-counter');
    
    // Create result counter if it doesn't exist
    if (!resultCounter) {
        console.log('Creating result counter element');
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
    
    // Log initial state
    console.log('Initial state:');
    console.log('Search input value:', searchInput ? searchInput.value : 'Element not found');
    console.log('Result counter display:', resultCounter ? getComputedStyle(resultCounter).display : 'Element not found');
    
    // Test with search
    if (searchInput && resultCounter) {
        // Set up observer to watch for style changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    console.log('Result counter display changed to:', getComputedStyle(resultCounter).display);
                }
            });
        });
        
        observer.observe(resultCounter, { attributes: true });
        
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
            
            // Clear search
            console.log('Testing with empty search...');
            searchInput.value = '';
            searchInput.dispatchEvent(event);
            
            // Check after another delay
            setTimeout(function() {
                console.log('After clearing search:');
                console.log('Search input value:', searchInput.value);
                console.log('Result counter display:', getComputedStyle(resultCounter).display);
                
                // Clean up
                observer.disconnect();
            }, 500);
        }, 500);
    }
}); 