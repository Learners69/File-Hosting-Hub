// Search Optimization

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const linkCards = document.querySelectorAll('.link-card');
    
    // Create search index for faster searching
    const searchIndex = buildSearchIndex(linkCards);
    
    // Debounce function to limit search frequency
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    // Build search index from link cards
    function buildSearchIndex(cards) {
        const index = [];
        
        cards.forEach((card, cardIndex) => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            // Get metadata
            let tags = [];
            let dateAdded = '';
            let fileType = '';
            let source = '';
            
            // Extract metadata from card
            const metadata = card.querySelector('.metadata');
            if (metadata) {
                // Get all spans within metadata
                const metadataSpans = metadata.querySelectorAll('span');
                metadataSpans.forEach(span => {
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
                    tags.push(tag.textContent.trim().toLowerCase());
                });
            }
            
            // Add to index
            index.push({
                id: cardIndex,
                title: title,
                description: description,
                tags: tags,
                dateAdded: dateAdded,
                fileType: fileType,
                source: source,
                element: card
            });
        });
        
        return index;
    }
    
    // Perform optimized search
    function performOptimizedSearch(searchTerm) {
        if (!searchTerm) return searchIndex.map(item => item.element);
        
        // Parse advanced search operators
        const searchParams = parseAdvancedSearch(searchTerm);
        
        // Filter index based on search parameters
        const results = searchIndex.filter(item => {
            let isMatch = true;
            
            // Check basic search term if no advanced operators
            if (!searchParams.hasAdvanced && searchParams.basicTerm) {
                isMatch = item.title.includes(searchParams.basicTerm) || 
                          item.description.includes(searchParams.basicTerm) ||
                          item.tags.some(tag => tag.includes(searchParams.basicTerm)) ||
                          item.dateAdded.includes(searchParams.basicTerm) ||
                          item.fileType.includes(searchParams.basicTerm) ||
                          item.source.includes(searchParams.basicTerm);
            }
            
            // Check title specific search
            if (isMatch && searchParams.title) {
                isMatch = item.title.includes(searchParams.title);
            }
            
            // Check tag specific search
            if (isMatch && searchParams.tag) {
                isMatch = item.tags.some(tag => tag.includes(searchParams.tag));
            }
            
            // Check type specific search
            if (isMatch && searchParams.type) {
                isMatch = item.fileType.includes(searchParams.type);
            }
            
            // Check source specific search
            if (isMatch && searchParams.source) {
                isMatch = item.source.includes(searchParams.source);
            }
            
            // Check date specific search
            if (isMatch && searchParams.date) {
                isMatch = item.dateAdded.includes(searchParams.date);
            }
            
            // Check NOT conditions
            if (isMatch && searchParams.notTerms.length > 0) {
                const allText = item.title + ' ' + item.description + ' ' + 
                                item.tags.join(' ') + ' ' + item.dateAdded + ' ' + 
                                item.fileType + ' ' + item.source;
                
                for (const notTerm of searchParams.notTerms) {
                    if (allText.includes(notTerm)) {
                        isMatch = false;
                        break;
                    }
                }
            }
            
            return isMatch;
        });
        
        return results.map(item => item.element);
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
        
        let searchTermCopy = searchTerm.toLowerCase();
        
        // Extract title search
        const titleMatch = titleRegex.exec(searchTermCopy);
        if (titleMatch) {
            result.title = titleMatch[1].toLowerCase();
            searchTermCopy = searchTermCopy.replace(titleMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract tag search
        const tagMatch = tagRegex.exec(searchTermCopy);
        if (tagMatch) {
            result.tag = tagMatch[1].toLowerCase();
            searchTermCopy = searchTermCopy.replace(tagMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract type search
        const typeMatch = typeRegex.exec(searchTermCopy);
        if (typeMatch) {
            result.type = typeMatch[1].toLowerCase();
            searchTermCopy = searchTermCopy.replace(typeMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract source search
        const sourceMatch = sourceRegex.exec(searchTermCopy);
        if (sourceMatch) {
            result.source = sourceMatch[1].toLowerCase();
            searchTermCopy = searchTermCopy.replace(sourceMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract date search
        const dateMatch = dateRegex.exec(searchTermCopy);
        if (dateMatch) {
            result.date = dateMatch[1].toLowerCase();
            searchTermCopy = searchTermCopy.replace(dateMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Extract NOT terms
        let notMatch;
        while ((notMatch = notRegex.exec(searchTermCopy)) !== null) {
            result.notTerms.push(notMatch[1].toLowerCase());
            searchTermCopy = searchTermCopy.replace(notMatch[0], '');
            result.hasAdvanced = true;
        }
        
        // Whatever remains is the basic search term
        result.basicTerm = searchTermCopy.trim().toLowerCase();
        
        return result;
    }
    
    // Expose optimized search to window for use in other scripts
    window.performOptimizedSearch = performOptimizedSearch;
    
    // Expose debounce function to window
    window.debounceFunction = debounce;
}); 