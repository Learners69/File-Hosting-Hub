// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    mobileMenuToggle.innerHTML = '&#9776;'; // Hamburger icon
    mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    const nav = document.querySelector('nav');
    nav.parentNode.insertBefore(mobileMenuToggle, nav);
    
    // Create overlay for mobile menu
    const menuOverlay = document.createElement('div');
    menuOverlay.classList.add('menu-overlay');
    document.body.appendChild(menuOverlay);
    
    // Create close button inside the menu
    const mobileMenuClose = document.createElement('button');
    mobileMenuClose.classList.add('mobile-menu-close');
    mobileMenuClose.innerHTML = '&times;'; // X icon
    mobileMenuClose.setAttribute('aria-label', 'Close navigation menu');
    nav.querySelector('ul').prepend(mobileMenuClose);
    
    // Toggle menu when hamburger icon is clicked
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });
    
    // Close menu when X button is clicked
    mobileMenuClose.addEventListener('click', function() {
        nav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close menu when overlay is clicked
    menuOverlay.addEventListener('click', function() {
        nav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!nav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            nav.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const linkCards = document.querySelectorAll('.link-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide cards based on filter
            linkCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardCategory = card.getAttribute('data-category') || card.getAttribute('data-type');
                    if (cardCategory === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Sort functionality
    const sortButtons = document.querySelectorAll('.sort-btn');
    const linkGrid = document.querySelector('.link-grid');
    
    if (sortButtons.length > 0 && linkGrid) {
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                sortButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const sortType = this.getAttribute('data-sort');
                const cards = Array.from(linkGrid.querySelectorAll('.link-card'));
                
                // Sort cards based on sort type
                cards.sort((a, b) => {
                    if (sortType === 'date-desc') {
                        // Convert date strings to Date objects for comparison
                        const dateA = new Date(a.getAttribute('data-date'));
                        const dateB = new Date(b.getAttribute('data-date'));
                        return dateB - dateA;
                    } else if (sortType === 'date-asc') {
                        const dateA = new Date(a.getAttribute('data-date'));
                        const dateB = new Date(b.getAttribute('data-date'));
                        return dateA - dateB;
                    } else if (sortType === 'name-asc') {
                        return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                    } else if (sortType === 'name-desc') {
                        return b.getAttribute('data-name').localeCompare(a.getAttribute('data-name'));
                    } else if (sortType === 'size-desc') {
                        // Extract size from the metadata
                        const sizeA = extractFileSize(a);
                        const sizeB = extractFileSize(b);
                        return sizeB - sizeA;
                    } else if (sortType === 'size-asc') {
                        const sizeA = extractFileSize(a);
                        const sizeB = extractFileSize(b);
                        return sizeA - sizeB;
                    }
                    return 0;
                });
                
                // Reappend sorted cards to grid
                cards.forEach(card => {
                    linkGrid.appendChild(card);
                });
            });
        });
    }
    
    // Helper function to extract file size in MB from card
    function extractFileSize(card) {
        const sizeElement = card.querySelector('.file-size');
        if (!sizeElement) return 0;
        
        const sizeText = sizeElement.textContent;
        const sizeMatch = sizeText.match(/(\d+(\.\d+)?)\s*MB/i);
        
        if (sizeMatch && sizeMatch[1]) {
            return parseFloat(sizeMatch[1]);
        }
        
        return 0;
    }

    // Enhanced external link indicators and validation
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        // Add external link icon or indicator
        link.classList.add('external-link');
        
        // Add link preview tooltip
        const url = link.getAttribute('href');
        const tooltipText = url.length > 50 ? url.substring(0, 47) + '...' : url;
        
        const tooltip = document.createElement('span');
        tooltip.classList.add('link-tooltip');
        tooltip.textContent = tooltipText;
        link.appendChild(tooltip);
        
        // Add status indicator
        const statusIndicator = document.createElement('span');
        statusIndicator.classList.add('link-status');
        link.appendChild(statusIndicator);
        
        // Check link status (simulated)
        checkLinkStatus(link, statusIndicator);
        
        // Add click event to validate URL before opening
        link.addEventListener('click', function(event) {
            // Basic URL validation
            if (!url || !url.startsWith('http')) {
                event.preventDefault();
                alert('Invalid URL: ' + url);
                return;
            }
            
            // Add loading animation to link
            this.classList.add('loading');
            
            // Remove loading class after a delay (simulating page load)
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1500);
            
            // Optional: Log click for analytics
            console.log('External link clicked: ' + url);
        });
        
        // Add hover effect to show full URL
        link.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        link.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
    
    // Function to check link status (simulated)
    function checkLinkStatus(link, indicator) {
        const url = link.getAttribute('href');
        
        // Simulate link checking with random status
        // In a real implementation, you would use fetch or another method to check the URL
        setTimeout(() => {
            const random = Math.random();
            
            if (random > 0.9) {
                // Simulate dead link (10% chance)
                indicator.classList.add('status-error');
                indicator.setAttribute('title', 'This link may be unavailable');
                link.classList.add('potentially-dead-link');
            } else if (random > 0.7) {
                // Simulate slow link (20% chance)
                indicator.classList.add('status-warning');
                indicator.setAttribute('title', 'This link may load slowly');
            } else {
                // Simulate good link (70% chance)
                indicator.classList.add('status-good');
                indicator.setAttribute('title', 'Link verified');
            }
        }, 1000);
    }
    
    // Add CSS for link tooltips and status indicators
    const style = document.createElement('style');
    style.textContent = `
        .link-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        
        .link-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
        
        .link-status {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-left: 5px;
            background-color: #ccc;
        }
        
        .status-good {
            background-color: #4caf50;
        }
        
        .status-warning {
            background-color: #ff9800;
        }
        
        .status-error {
            background-color: #f44336;
        }
        
        .potentially-dead-link {
            text-decoration: line-through;
            opacity: 0.7;
        }
        
        .potentially-dead-link:hover {
            text-decoration: none;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}); 