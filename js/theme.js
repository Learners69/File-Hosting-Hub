// Theme switching functionality

document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const root = document.documentElement;
    
    // Create theme transition overlay
    const themeTransitionOverlay = document.createElement('div');
    themeTransitionOverlay.classList.add('theme-transition-overlay');
    document.body.appendChild(themeTransitionOverlay);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        updateToggleButtonText('Light Mode');
        updateThemeMetaTag('#121212'); // Dark theme color
    } else {
        updateToggleButtonText('Dark Mode');
        updateThemeMetaTag('#4a6fa5'); // Light theme color
    }
    
    // Toggle theme on button click with animation
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Show transition overlay
            themeTransitionOverlay.classList.add('active');
            
            // Delay theme change to allow for animation
            setTimeout(() => {
                // Toggle dark theme class
                body.classList.toggle('dark-theme');
                
                // Save preference to localStorage
                if (body.classList.contains('dark-theme')) {
                    localStorage.setItem('theme', 'dark');
                    updateToggleButtonText('Light Mode');
                    updateThemeMetaTag('#121212'); // Dark theme color
                } else {
                    localStorage.setItem('theme', 'light');
                    updateToggleButtonText('Dark Mode');
                    updateThemeMetaTag('#4a6fa5'); // Light theme color
                }
                
                // Hide transition overlay
                setTimeout(() => {
                    themeTransitionOverlay.classList.remove('active');
                }, 300);
            }, 200);
        });
    }
    
    // Update button text based on current theme
    function updateToggleButtonText(text) {
        if (themeToggleBtn) {
            // Add icon to the button
            const iconClass = text === 'Dark Mode' ? 'moon-icon' : 'sun-icon';
            themeToggleBtn.innerHTML = `<span class="${iconClass}"></span> ${text}`;
        }
    }
    
    // Update theme-color meta tag for browser UI
    function updateThemeMetaTag(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }
    
    // Check for system preference if no saved preference
    if (!savedTheme) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (prefersDarkScheme.matches) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateToggleButtonText('Light Mode');
            updateThemeMetaTag('#121212'); // Dark theme color
        }
        
        // Listen for changes in system preference
        prefersDarkScheme.addEventListener('change', function(event) {
            // Show transition overlay
            themeTransitionOverlay.classList.add('active');
            
            setTimeout(() => {
                if (event.matches) {
                    body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark');
                    updateToggleButtonText('Light Mode');
                    updateThemeMetaTag('#121212'); // Dark theme color
                } else {
                    body.classList.remove('dark-theme');
                    localStorage.setItem('theme', 'light');
                    updateToggleButtonText('Dark Mode');
                    updateThemeMetaTag('#4a6fa5'); // Light theme color
                }
                
                // Hide transition overlay
                setTimeout(() => {
                    themeTransitionOverlay.classList.remove('active');
                }, 300);
            }, 200);
        });
    }
    
    // Add CSS for theme icons and transition overlay
    const style = document.createElement('style');
    style.textContent = `
        .moon-icon::before {
            content: '🌙';
            margin-right: 5px;
        }
        
        .sun-icon::before {
            content: '☀️';
            margin-right: 5px;
        }
        
        .theme-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        
        .theme-transition-overlay.active {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(style);
}); 