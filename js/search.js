// Advanced Search and Filter Functionality

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const linkCards = document.querySelectorAll('.link-card');
    const advancedSearchToggle = document.getElementById('advanced-search-toggle');
    let searchTimeout;
    
    // Initialize tag system
    initializeTagSystem();
    
    // Hide result counter on initial load
    const resultCounter = document.querySelector('.result-counter');
    if (resultCounter) {
        resultCounter.style.display = 'none';
    }
    
    // Add resize event listener to update result counter classes
    window.addEventListener('resize', function() {
        const resultCounter = document.querySelector('.result-counter');
        if (resultCounter) {
            updateResultCounterClasses(resultCounter);
        }
    });
    
    // Function to update result counter classes based on screen width
    function updateResultCounterClasses(resultCounter) {
        const screenWidth = window.innerWidth;
        resultCounter.classList.remove('result-counter-mobile', 'result-counter-tablet', 'result-counter-desktop');
        
        if (screenWidth < 768) {
            resultCounter.classList.add('result-counter-mobile');
        } else if (screenWidth >= 768 && screenWidth < 1024) {
            resultCounter.classList.add('result-counter-tablet');
        } else {
            resultCounter.classList.add('result-counter-desktop');
        }
    }
    
    // Function to perform search with debouncing
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all cards
            linkCards.forEach(card => {
                card.style.display = 'flex';
                card.classList.remove('search-highlight');
            });
            
            // Reset any active filters
            resetActiveFilters();
            
            // Hide no results message
            hideNoResultsMessage();
            
            // Hide result counter when not searching
            const resultCounter = document.querySelector('.result-counter');
            if (resultCounter) {
                resultCounter.style.display = 'none';
            }
            
            return;
        }
        
        // Use optimized search if available
        if (window.performOptimizedSearch) {
            const matchingCards = window.performOptimizedSearch(searchTerm);
            
            // Hide all cards first
            linkCards.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('search-highlight');
                removeHighlights(card);
            });
            
            // Show matching cards
            matchingCards.forEach(card => {
                card.style.display = 'flex';
                card.classList.add('search-highlight');
                
                // Highlight matching text
                highlightMatches(card, parseAdvancedSearch(searchTerm));
            });
            
            // Check if no results found
            if (matchingCards.length === 0) {
                showNoResultsMessage(searchTerm);
            } else {
                hideNoResultsMessage();
            }
            
            // Update result count
            updateResultCount(matchingCards.length);
            return;
        }
        
        // Fallback to original search if optimized search is not available
        // Parse advanced search operators
        const searchParams = parseAdvancedSearch(searchTerm);
        
        // Filter cards based on search parameters
        let matchCount = 0;
        
        linkCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            // Get additional searchable content
            const metadata = card.querySelector('.metadata');
            let metadataContent = '';
            let tags = [];
            let dateAdded = '';
            let fileType = '';
            let source = '';
            
            if (metadata) {
                // Get all spans within metadata
                const metadataSpans = metadata.querySelectorAll('span');
                metadataSpans.forEach(span => {
                    metadataContent += ' ' + span.textContent.toLowerCase();
                    
                    // Extract specific metadata
                    if (span.classList.contains('date-added')) {
                        dateAdded = span.textContent.toLowerCase();
                    }
                    if (span.classList.contains('file-type')) {
                        fileType = span.textContent.toLowerCase();
                    }
                    if (span.classList.contains('source')) {
                        source = span.textContent.toLowerCase();
                    }
                });
                
                // Get all tags
                const tagElements = metadata.querySelectorAll('.tag');
                tagElements.forEach(tag => {
                    const tagText = tag.textContent.toLowerCase();
                    tags.push(tagText);
                    metadataContent += ' ' + tagText;
                });
            } else {
                // Legacy support for cards without metadata div
                const dateElement = card.querySelector('.date-added');
                const sourceElement = card.querySelector('.source');
                const tagsElement = card.querySelector('.tags');
                const fileTypeElement = card.querySelector('.file-type');
                
                if (dateElement) {
                    dateAdded = dateElement.textContent.toLowerCase();
                    metadataContent += ' ' + dateAdded;
                }
                if (sourceElement) {
                    source = sourceElement.textContent.toLowerCase();
                    metadataContent += ' ' + source;
                }
                if (tagsElement) {
                    const tagText = tagsElement.textContent.toLowerCase();
                    tags = tagText.split(',').map(t => t.trim());
                    metadataContent += ' ' + tagText;
                }
                if (fileTypeElement) {
                    fileType = fileTypeElement.textContent.toLowerCase();
                    metadataContent += ' ' + fileType;
                }
            }
            
            // Combine all searchable content
            const searchableContent = title + ' ' + description + ' ' + metadataContent;
            
            // Check if card matches all search parameters
            let isMatch = true;
            
            // Check basic search term if no advanced operators
            if (!searchParams.hasAdvanced && searchParams.basicTerm) {
                isMatch = searchableContent.includes(searchParams.basicTerm);
            }
            
            // Check title specific search
            if (isMatch && searchParams.title) {
                isMatch = title.includes(searchParams.title);
            }
            
            // Check tag specific search
            if (isMatch && searchParams.tag) {
                isMatch = tags.some(tag => tag.includes(searchParams.tag));
            }
            
            // Check type specific search
            if (isMatch && searchParams.type) {
                isMatch = fileType.includes(searchParams.type);
            }
            
            // Check source specific search
            if (isMatch && searchParams.source) {
                isMatch = source.includes(searchParams.source);
            }
            
            // Check date specific search
            if (isMatch && searchParams.date) {
                isMatch = dateAdded.includes(searchParams.date);
            }
            
            // Check NOT conditions
            if (isMatch && searchParams.notTerms.length > 0) {
                for (const notTerm of searchParams.notTerms) {
                    if (searchableContent.includes(notTerm)) {
                        isMatch = false;
                        break;
                    }
                }
            }
            
            // Update card visibility based on match
            if (isMatch) {
                card.style.display = 'flex';
                card.classList.add('search-highlight');
                matchCount++;
                
                // Highlight matching text
                highlightMatches(card, searchParams);
            } else {
                card.style.display = 'none';
                card.classList.remove('search-highlight');
                
                // Remove any highlights
                removeHighlights(card);
            }
        });
        
        // Check if no results found
        if (matchCount === 0) {
            showNoResultsMessage(searchTerm);
        } else {
            hideNoResultsMessage();
        }
        
        // Update result count
        updateResultCount(matchCount);
    }
    
    // Function to parse advanced search operators
    function parseAdvancedSearch(searchTerm) {
        const result = {
            basicTerm: '',
            title: '',
            tag: '',
            type: '',
            source: '',
            date: '',
            notTerms: [],
            hasAdvanced: false
        };
        
        // Regular expressions for advanced search operators
        const titleRegex = /title:([^\s]+)/g;
        const tagRegex = /tag:([^\s]+)/g;
        const typeRegex = /type:([^\s]+)/g;
        const sourceRegex = /source:([^\s]+)/g;
        const dateRegex = /date:([^\s]+)/g;
        const notRegex = /-([^\s]+)/g;
        
        // Extract title search
        const titleMatch = titleRegex.exec(searchTerm);
        if (titleMatch) {
            result.title = titleMatch[1].toLowerCase();
            searchTerm = searchTerm.replace(titleMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract tag search
        const tagMatch = tagRegex.exec(searchTerm);
        if (tagMatch) {
            result.tag = tagMatch[1].toLowerCase();
            searchTerm = searchTerm.replace(tagMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract type search
        const typeMatch = typeRegex.exec(searchTerm);
        if (typeMatch) {
            result.type = typeMatch[1].toLowerCase();
            searchTerm = searchTerm.replace(typeMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract source search
        const sourceMatch = sourceRegex.exec(searchTerm);
        if (sourceMatch) {
            result.source = sourceMatch[1].toLowerCase();
            searchTerm = searchTerm.replace(sourceMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract date search
        const dateMatch = dateRegex.exec(searchTerm);
        if (dateMatch) {
            result.date = dateMatch[1].toLowerCase();
            searchTerm = searchTerm.replace(dateMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract NOT terms
        let notMatch;
        while ((notMatch = notRegex.exec(searchTerm)) !== null) {
            result.notTerms.push(notMatch[1].toLowerCase());
            searchTerm = searchTerm.replace(notMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Whatever remains is the basic search term
        result.basicTerm = searchTerm.trim().toLowerCase();
        
        return result;
    }
    
    // Function to highlight matching text based on search parameters
    function highlightMatches(card, searchParams) {
        // Remove existing highlights first
        removeHighlights(card);
        
        // Elements to search in
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        // Highlight basic term
        if (searchParams.basicTerm) {
            if (title.textContent.toLowerCase().includes(searchParams.basicTerm)) {
                highlightText(title, searchParams.basicTerm);
            }
            
            if (description.textContent.toLowerCase().includes(searchParams.basicTerm)) {
                highlightText(description, searchParams.basicTerm);
            }
        }
        
        // Highlight title specific term
        if (searchParams.title && title.textContent.toLowerCase().includes(searchParams.title)) {
            highlightText(title, searchParams.title);
        }
        
        // Highlight in description for other specific terms
        const allTerms = [
            searchParams.tag, 
            searchParams.type, 
            searchParams.source, 
            searchParams.date
        ].filter(term => term);
        
        for (const term of allTerms) {
            if (description.textContent.toLowerCase().includes(term)) {
                highlightText(description, term);
            }
        }
    }
    
    // Function to highlight text within an element
    function highlightText(element, searchTerm) {
        const text = element.textContent;
        const regex = new RegExp('(' + escapeRegExp(searchTerm) + ')', 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        element.innerHTML = highlightedText;
    }
    
    // Helper function to escape special regex characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Function to remove highlights
    function removeHighlights(card) {
        const highlightedElements = card.querySelectorAll('mark');
        highlightedElements.forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
    }
    
    // Function to reset active filters
    function resetActiveFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        if (filterButtons.length > 0) {
            // Set "All" button as active
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // Reset tag filters
        const tagFilters = document.querySelectorAll('.tag-filter');
        tagFilters.forEach(tag => {
            tag.classList.remove('active');
        });
    }
    
    // Function to show no results message
    function showNoResultsMessage(searchTerm) {
        // Remove any existing no results message
        hideNoResultsMessage();
        
        // Create and append no results message
        const noResultsMessage = document.createElement('div');
        noResultsMessage.classList.add('no-results-message');
        noResultsMessage.innerHTML = `
            <p>No results found for "<strong>${searchTerm}</strong>".</p>
            <p>Try different keywords or check your spelling.</p>
            <p>You can also use advanced search operators like:</p>
            <ul>
                <li><code>title:keyword</code> - Search in titles only</li>
                <li><code>tag:keyword</code> - Search in tags only</li>
                <li><code>type:pdf</code> - Filter by file type</li>
                <li><code>-keyword</code> - Exclude results with this keyword</li>
            </ul>
        `;
        
        const linkGrid = document.querySelector('.link-grid');
        linkGrid.parentNode.insertBefore(noResultsMessage, linkGrid.nextSibling);
    }
    
    // Function to hide no results message
    function hideNoResultsMessage() {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    // Function to update result count
    function updateResultCount(count) {
        let resultCounter = document.querySelector('.result-counter');
        
        if (!resultCounter) {
            resultCounter = document.createElement('div');
            resultCounter.classList.add('result-counter');
            const searchContainer = document.querySelector('.search-container');
            searchContainer.appendChild(resultCounter);
        }
        
        // Add device-specific classes
        updateResultCounterClasses(resultCounter);
        
        // Only show the counter if we're actually searching
        const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
        if (searchTerm === '' || count === linkCards.length) {
            resultCounter.style.display = 'none';
        } else {
            resultCounter.style.display = 'block';
            resultCounter.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
        }
    }
    
    // Initialize tag system
    function initializeTagSystem() {
        // Extract all unique tags from link cards
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
            });
            
            tagContainer.appendChild(tagElement);
        });
    }
    
    // Filter cards by selected tags
    function filterCardsByTags() {
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
    
    // Toggle advanced search UI
    if (advancedSearchToggle) {
        advancedSearchToggle.addEventListener('click', function() {
            const advancedSearchPanel = document.querySelector('.advanced-search-panel');
            
            if (advancedSearchPanel) {
                advancedSearchPanel.classList.toggle('active');
                this.textContent = advancedSearchPanel.classList.contains('active') 
                    ? 'Hide Advanced Search' 
                    : 'Show Advanced Search';
            }
        });
    }
    
    // Search button click event
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    // Search input keyup event with debouncing
    if (searchInput) {
        // Use debounce function from optimization if available
        const debouncedSearch = window.debounceFunction 
            ? window.debounceFunction(performSearch, 300) 
            : function(event) {
                // Fallback debounce implementation
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(performSearch, 300);
              };
        
        searchInput.addEventListener('keyup', function(event) {
            // Perform search on Enter key press immediately
            if (event.key === 'Enter') {
                clearTimeout(searchTimeout);
                performSearch();
                return;
            }
            
            // Use debounced search
            debouncedSearch();
        });
    }
    
    // Clear search when clicking on navigation links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                performSearch();
            }
        });
    });
}); 