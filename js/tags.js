// Tag System Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tag system
    initializeTagSystem();
    
    // Function to initialize tag system
    function initializeTagSystem() {
        // Extract all unique tags from link cards
        const linkCards = document.querySelectorAll('.link-card');
        const allTags = new Set();
        
        linkCards.forEach(card => {
            const tagElements = card.querySelectorAll('.tag');
            tagElements.forEach(tag => {
                allTags.add(tag.textContent.trim());
            });
        });
        
        // Create tag filter UI if we have tags
        if (allTags.size > 0) {
            createTagFilterUI(Array.from(allTags));
        }
    }
    
    // Create tag filter UI
    function createTagFilterUI(tags) {
        // Check if tag filter section already exists
        let tagFilterSection = document.querySelector('.tag-filters');
        
        if (!tagFilterSection) {
            // Create tag filter section
            tagFilterSection = document.createElement('div');
            tagFilterSection.classList.add('tag-filters');
            
            const heading = document.createElement('h3');
            heading.textContent = 'Filter by Tags';
            tagFilterSection.appendChild(heading);
            
            const tagContainer = document.createElement('div');
            tagContainer.classList.add('tag-container');
            tagFilterSection.appendChild(tagContainer);
            
            // Add tag filter section after regular filters
            const filtersSection = document.querySelector('.filters .container');
            if (filtersSection) {
                filtersSection.appendChild(tagFilterSection);
            }
        }
        
        // Get tag container
        const tagContainer = tagFilterSection.querySelector('.tag-container');
        
        // Clear existing tags
        tagContainer.innerHTML = '';
        
        // Add tags to container
        tags.sort().forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag-filter');
            tagElement.textContent = tag;
            tagElement.setAttribute('data-tag', tag.toLowerCase());
            
            // Add click event to filter by tag
            tagElement.addEventListener('click', function() {
                const isActive = this.classList.toggle('active');
                
                // Filter cards by selected tags
                filterCardsByTags();
                
                // Update URL with selected tags for bookmarking
                updateUrlWithTags();
            });
            
            tagContainer.appendChild(tagElement);
        });
        
        // Check URL for tag parameters on page load
        applyTagFiltersFromUrl();
    }
    
    // Filter cards by selected tags
    function filterCardsByTags() {
        const linkCards = document.querySelectorAll('.link-card');
        const selectedTags = Array.from(document.querySelectorAll('.tag-filter.active'))
            .map(tag => tag.getAttribute('data-tag'));
        
        // If no tags selected, show all cards
        if (selectedTags.length === 0) {
            linkCards.forEach(card => {
                card.style.display = 'flex';
            });
            return;
        }
        
        // Filter cards based on selected tags
        linkCards.forEach(card => {
            const cardTags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent.trim().toLowerCase());
            
            // Check if card has any of the selected tags
            const hasSelectedTag = selectedTags.some(tag => cardTags.includes(tag));
            
            card.style.display = hasSelectedTag ? 'flex' : 'none';
        });
        
        // Update result count
        const visibleCards = document.querySelectorAll('.link-card[style*="display: flex"]');
        updateResultCount(visibleCards.length);
    }
    
    // Update URL with selected tags for bookmarking
    function updateUrlWithTags() {
        const selectedTags = Array.from(document.querySelectorAll('.tag-filter.active'))
            .map(tag => tag.getAttribute('data-tag'));
        
        const url = new URL(window.location.href);
        
        // Remove existing tag parameters
        const searchParams = url.searchParams;
        searchParams.delete('tags');
        
        // Add selected tags as parameter
        if (selectedTags.length > 0) {
            searchParams.set('tags', selectedTags.join(','));
        }
        
        // Update URL without reloading page
        window.history.replaceState({}, '', url.toString());
    }
    
    // Apply tag filters from URL parameters
    function applyTagFiltersFromUrl() {
        const url = new URL(window.location.href);
        const tagParam = url.searchParams.get('tags');
        
        if (tagParam) {
            const tagsToSelect = tagParam.split(',');
            
            // Select tags that match URL parameters
            document.querySelectorAll('.tag-filter').forEach(tagElement => {
                const tagValue = tagElement.getAttribute('data-tag');
                if (tagsToSelect.includes(tagValue)) {
                    tagElement.classList.add('active');
                }
            });
            
            // Apply filtering
            filterCardsByTags();
        }
    }
    
    // Function to update result count
    function updateResultCount(count) {
        let resultCounter = document.querySelector('.result-counter');
        
        if (!resultCounter) {
            resultCounter = document.createElement('div');
            resultCounter.classList.add('result-counter');
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.appendChild(resultCounter);
            }
        }
        
        resultCounter.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
    }
}); 