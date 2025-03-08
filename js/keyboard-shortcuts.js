// Keyboard shortcuts for power users

document.addEventListener('DOMContentLoaded', function() {
    // Keyboard shortcut map
    const shortcuts = {
        '/': focusSearch,
        'Escape': clearSearch,
        'Alt+t': toggleTheme,
        'Alt+h': navigateHome,
        'Alt+p': navigateToPdfs,
        'Alt+n': navigateToNotes,
        'Alt+f': navigateToFiles,
        'Alt+a': toggleAdvancedSearch,
        'Alt+s': toggleSortOptions
    };
    
    // Add keyboard event listener
    document.addEventListener('keydown', function(event) {
        // Skip if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            // Only handle Escape key for inputs
            if (event.key !== 'Escape') return;
        }
        
        // Handle key combinations
        const key = event.altKey ? `Alt+${event.key.toLowerCase()}` : event.key;
        
        if (shortcuts[key]) {
            event.preventDefault();
            shortcuts[key]();
        }
    });
    
    // Display keyboard shortcuts help
    const helpButton = document.createElement('button');
    helpButton.id = 'keyboard-help-btn';
    helpButton.textContent = '?';
    helpButton.setAttribute('aria-label', 'Keyboard shortcuts help');
    helpButton.classList.add('keyboard-help-btn');
    
    document.body.appendChild(helpButton);
    
    helpButton.addEventListener('click', showShortcutsHelp);
    
    // Add keyboard shortcut for help (?)
    document.addEventListener('keydown', function(event) {
        if (event.key === '?' && !event.altKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            showShortcutsHelp();
        }
    });
    
    // Shortcut functions
    function focusSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    function clearSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            // Trigger search update if needed
            const event = new Event('input', { bubbles: true });
            searchInput.dispatchEvent(event);
        }
    }
    
    function toggleTheme() {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            themeToggleBtn.click();
        }
    }
    
    function navigateHome() {
        window.location.href = 'index.html';
    }
    
    function navigateToPdfs() {
        window.location.href = 'pdfs.html';
    }
    
    function navigateToNotes() {
        window.location.href = 'notes.html';
    }
    
    function navigateToFiles() {
        window.location.href = 'files.html';
    }
    
    function toggleAdvancedSearch() {
        const advancedSearchToggle = document.getElementById('advanced-search-toggle');
        if (advancedSearchToggle) {
            advancedSearchToggle.click();
        }
    }
    
    function toggleSortOptions() {
        const sortToggle = document.querySelector('.sort-toggle');
        if (sortToggle) {
            sortToggle.click();
        }
    }
    
    function showShortcutsHelp() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('shortcuts-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'shortcuts-modal';
            modal.classList.add('shortcuts-modal');
            
            const modalContent = document.createElement('div');
            modalContent.classList.add('shortcuts-modal-content');
            
            const closeBtn = document.createElement('span');
            closeBtn.classList.add('close-modal');
            closeBtn.innerHTML = '&times;';
            closeBtn.setAttribute('role', 'button');
            closeBtn.setAttribute('aria-label', 'Close shortcuts help');
            closeBtn.setAttribute('tabindex', '0');
            
            // Add both click and touch events for better mobile experience
            closeBtn.addEventListener('click', function() {
                closeModal();
            });
            
            closeBtn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    closeModal();
                }
            });
            
            const title = document.createElement('h3');
            title.textContent = 'Keyboard Shortcuts';
            
            const shortcutsList = document.createElement('ul');
            shortcutsList.classList.add('shortcuts-list');
            
            // Add all shortcuts to the list
            const shortcutDescriptions = {
                '/': 'Focus search box',
                'Escape': 'Clear search input',
                'Alt+t': 'Toggle light/dark theme',
                'Alt+h': 'Navigate to home page',
                'Alt+p': 'Navigate to PDFs page',
                'Alt+n': 'Navigate to Notes page',
                'Alt+f': 'Navigate to Files page',
                'Alt+a': 'Toggle advanced search',
                'Alt+s': 'Toggle sort options',
                '?': 'Show this help dialog'
            };
            
            for (const [key, description] of Object.entries(shortcutDescriptions)) {
                const listItem = document.createElement('li');
                const keySpan = document.createElement('span');
                keySpan.classList.add('shortcut-key');
                keySpan.textContent = key;
                
                const descSpan = document.createElement('span');
                descSpan.textContent = description;
                descSpan.classList.add('shortcut-description');
                
                listItem.appendChild(keySpan);
                listItem.appendChild(descSpan);
                shortcutsList.appendChild(listItem);
            }
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(title);
            modalContent.appendChild(shortcutsList);
            modal.appendChild(modalContent);
            
            document.body.appendChild(modal);
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
            
            // Add touch events for mobile
            modalContent.addEventListener('touchstart', function(e) {
                // Prevent default only inside the modal content to allow scrolling
                e.stopPropagation();
            });
            
            // Add swipe down to close for mobile
            let touchStartY = 0;
            let touchEndY = 0;
            
            modalContent.addEventListener('touchstart', function(e) {
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            modalContent.addEventListener('touchend', function(e) {
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                // If swiped down more than 50px on mobile
                if (touchEndY - touchStartY > 50 && window.innerWidth < 768) {
                    closeModal();
                }
            }
            
            // Close on Escape key
            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && modal.style.display === 'block') {
                    closeModal();
                }
            });
            
            // Add responsive class based on screen size
            updateModalResponsiveClass();
            window.addEventListener('resize', updateModalResponsiveClass);
        }
        
        // Show the modal
        modal.style.display = 'block';
        
        // Add flex display after setting display to block to enable animation
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 10);
        
        // Trap focus inside modal for accessibility
        trapFocus(modal);
    }
    
    function closeModal() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    function updateModalResponsiveClass() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            if (window.innerWidth < 768) {
                modal.classList.add('mobile-view');
                modal.classList.remove('tablet-view', 'desktop-view');
            } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                modal.classList.add('tablet-view');
                modal.classList.remove('mobile-view', 'desktop-view');
            } else {
                modal.classList.add('desktop-view');
                modal.classList.remove('mobile-view', 'tablet-view');
            }
        }
    }
    
    // Accessibility: trap focus inside modal
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Shift + Tab
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                // Tab
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        
        // Focus first element when modal opens
        firstFocusableElement.focus();
    }
}); 