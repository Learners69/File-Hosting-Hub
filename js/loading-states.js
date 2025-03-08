// Loading states and indicators

document.addEventListener('DOMContentLoaded', function() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Show loading overlay on page load
    showLoading();
    
    // Hide loading overlay when page is fully loaded
    window.addEventListener('load', function() {
        hideLoading();
    });
    
    // Add loading indicators to search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const linkGrid = document.querySelector('.link-grid');
    
    if (searchButton && linkGrid) {
        searchButton.addEventListener('click', function() {
            // Show loading state on the grid
            linkGrid.classList.add('searching');
            
            // Add small delay to simulate search processing
            setTimeout(() => {
                linkGrid.classList.remove('searching');
            }, 500);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (this.value.length > 2) {
                // Show mini loading indicator in search box
                this.classList.add('searching');
                
                // Remove after short delay
                setTimeout(() => {
                    this.classList.remove('searching');
                }, 300);
            }
        });
    }
    
    // Add loading indicators to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            // Add loading indicator to the clicked link
            this.classList.add('loading');
            
            // Show a small loading indicator next to cursor
            const cursorLoader = document.createElement('div');
            cursorLoader.classList.add('cursor-loader');
            document.body.appendChild(cursorLoader);
            
            // Position the loader near the cursor
            document.addEventListener('mousemove', updateCursorLoader);
            
            // Remove the cursor loader after a delay
            setTimeout(() => {
                document.removeEventListener('mousemove', updateCursorLoader);
                if (document.body.contains(cursorLoader)) {
                    document.body.removeChild(cursorLoader);
                }
            }, 1500);
        });
    });
    
    // Function to update cursor loader position
    function updateCursorLoader(e) {
        const cursorLoader = document.querySelector('.cursor-loader');
        if (cursorLoader) {
            cursorLoader.style.left = `${e.clientX + 15}px`;
            cursorLoader.style.top = `${e.clientY + 15}px`;
        }
    }
    
    // Add loading state to filter buttons
    document.querySelectorAll('.filter-btn, .tag-filter').forEach(button => {
        button.addEventListener('click', function() {
            // Add loading state to button
            this.classList.add('loading');
            
            // Remove loading state after filtering completes
            setTimeout(() => {
                this.classList.remove('loading');
            }, 300);
        });
    });
    
    // Global loading state functions
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    
    function showLoading() {
        loadingOverlay.classList.add('active');
        document.body.classList.add('loading');
    }
    
    function hideLoading() {
        loadingOverlay.classList.remove('active');
        document.body.classList.remove('loading');
    }
}); 