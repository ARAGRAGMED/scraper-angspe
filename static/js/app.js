// ANGSPE Publications Web App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load data when page loads
    loadDashboardData();
    loadPublicationsTable();
});

async function loadDashboardData() {
    try {
        // Load real data from the API endpoints
        const [publicationsResponse, statusResponse] = await Promise.all([
            fetch('/api/publications'),
            fetch('/api/status')
        ]);
        
        if (publicationsResponse.ok && statusResponse.ok) {
            const publications = await publicationsResponse.json();
            const status = await statusResponse.json();
            
            const dashboardData = {
                total_publications: publications.length,
                latest_publication: publications.length > 0 ? publications[0] : null,
                last_scrape: status.last_scrape,
                data_freshness: status.data_freshness,
                last_cron_run: status.last_cron_run,
                cron_status: status.cron_status
            };
            
            updateStats(dashboardData);
        } else {
            throw new Error('Failed to load data from API');
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to placeholder data if API fails
        const placeholderData = {
            total_publications: 2,
            latest_publication: {
                date_posted: '26/06/2025'
            },
            last_scrape: '2025-08-08T11:59:13.443379',
            data_freshness: 'current'
        };
        updateStats(placeholderData);
    }
}

async function loadPublicationsTable() {
    try {
        // Load real publications from the API
        const response = await fetch('/api/publications');
        
        if (response.ok) {
            const publications = await response.json();
            updatePublicationsTable(publications);
        } else {
            throw new Error('Failed to load publications');
        }
    } catch (error) {
        console.error('Error loading publications:', error);
        // Fallback to placeholder publications if API fails
        const placeholderPublications = [
            {
                title: "Rapport sur l'État actionnaire 2023 - 2024",
                category: "Rapport d'activités",
                date_posted: "26/06/2025",
                file_size: "6.92 Mo",
                download_url: "#"
            },
            {
                title: "Charte de gouvernance pour les EEP",
                category: "Autres rapports",
                date_posted: "22/05/2025",
                file_size: "1755 ko",
                download_url: "#"
            }
        ];
        
        updatePublicationsTable(placeholderPublications);
    }
}

function updateStats(data) {
    // Update total publications
    const totalEl = document.getElementById('total-publications');
    if (totalEl) totalEl.textContent = data.total_publications || 0;
    
    // Update latest publication date
    const latestDateEl = document.getElementById('latest-date');
    if (latestDateEl && data.latest_publication) {
        latestDateEl.textContent = data.latest_publication.date_posted || 'N/A';
    }
    
    // Update data freshness with real data
    updateDataFreshness(data.last_scrape, data.data_freshness);
    
    // Update last cron run information
    updateLastCronRun(data.last_cron_run, data.cron_status);
}

function updatePublicationsTable(publications) {
    const tbody = document.getElementById('publications-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    publications.forEach(pub => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <strong>${escapeHtml(pub.title)}</strong>
            </td>
            <td>
                <span class="category-badge">${escapeHtml(pub.category)}</span>
            </td>
            <td>${escapeHtml(pub.date_posted)}</td>
            <td>${escapeHtml(pub.file_size)}</td>
            <td>
                <a href="${escapeHtml(pub.download_url)}" 
                   target="_blank" 
                   class="btn btn-small"
                   title="Download ${escapeHtml(pub.title)}">
                    <i class="fas fa-download"></i> Download
                </a>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateDataFreshness(lastScrape, dataFreshness) {
    const freshnessEl = document.getElementById('data-freshness');
    if (!freshnessEl) return;
    
    if (lastScrape) {
        try {
            // Parse the ISO timestamp and format it nicely
            const scrapeDate = new Date(lastScrape);
            const now = new Date();
            const timeDiff = now - scrapeDate;
            
            // Calculate how long ago the data was scraped
            let timeAgo;
            if (timeDiff < 60000) { // Less than 1 minute
                timeAgo = 'Just now';
            } else if (timeDiff < 3600000) { // Less than 1 hour
                const minutes = Math.floor(timeDiff / 60000);
                timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else if (timeDiff < 86400000) { // Less than 1 day
                const hours = Math.floor(timeDiff / 3600000);
                timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(timeDiff / 86400000);
                timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
            }
            
            // Format the actual date
            const formattedDate = scrapeDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            freshnessEl.textContent = `${timeAgo}`;
            freshnessEl.title = `Last scraped: ${formattedDate}`;
        } catch (error) {
            console.error('Error parsing date:', error);
            freshnessEl.textContent = 'Unknown';
        }
    } else {
        freshnessEl.textContent = 'Never';
    }
}

function updateLastCronRun(lastCronRun, cronStatus) {
    const cronEl = document.getElementById('last-cron-run');
    if (!cronEl) return;
    
    if (lastCronRun) {
        try {
            // Parse the ISO timestamp and format it nicely
            const cronDate = new Date(lastCronRun);
            const now = new Date();
            const timeDiff = now - cronDate;
            
            // Calculate how long ago the cron job ran
            let timeAgo;
            if (timeDiff < 60000) { // Less than 1 minute
                timeAgo = 'Just now';
            } else if (timeDiff < 3600000) { // Less than 1 hour
                const minutes = Math.floor(timeDiff / 60000);
                timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else if (timeDiff < 86400000) { // Less than 1 day
                const hours = Math.floor(timeDiff / 3600000);
                timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                const days = Math.floor(timeDiff / 86400000);
                timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
            }
            
            // Format the actual date
            const formattedDate = cronDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Add status indicator
            const statusIcon = cronStatus === 'success' ? '✅' : '⚠️';
            cronEl.textContent = `${statusIcon} ${timeAgo}`;
            cronEl.title = `Last auto-update: ${formattedDate}\nStatus: ${cronStatus || 'unknown'}`;
        } catch (error) {
            console.error('Error parsing cron date:', error);
            cronEl.textContent = '⚠️ Unknown';
        }
    } else {
        cronEl.textContent = '⚠️ Never';
        cronEl.title = 'No automatic updates have run yet';
    }
}

function showNoPublications() {
    const tbody = document.getElementById('publications-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">
                    <i class="fas fa-info-circle"></i>
                    No publications found
                </td>
            </tr>
        `;
    }
}

function showError(message) {
    const tbody = document.getElementById('publications-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${escapeHtml(message)}
                </td>
            </tr>
        `;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add some interactive features
document.addEventListener('click', function(e) {
    // Handle category badge clicks
    if (e.target.classList.contains('category-badge')) {
        const category = e.target.textContent;
        filterByCategory(category);
    }
});

function filterByCategory(category) {
    const rows = document.querySelectorAll('#publications-tbody tr');
    
    rows.forEach(row => {
        const categoryCell = row.querySelector('td:nth-child(2)');
        if (categoryCell) {
            const rowCategory = categoryCell.textContent.trim();
            if (category === 'All' || rowCategory === category) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// Add search functionality
function addSearchBar() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="search-input" placeholder="Search publications..." class="search-input">
        <button onclick="clearSearch()" class="btn btn-small">Clear</button>
    `;
    
    const publicationsSection = document.querySelector('.publications-section');
    if (publicationsSection) {
        publicationsSection.insertBefore(searchContainer, publicationsSection.querySelector('h3').nextSibling);
        
        // Add search event listener
        document.getElementById('search-input').addEventListener('input', function(e) {
            searchPublications(e.target.value);
        });
    }
}

function searchPublications(query) {
    const rows = document.querySelectorAll('#publications-tbody tr');
    const searchTerm = query.toLowerCase();
    
    rows.forEach(row => {
        const title = row.querySelector('td:first-child').textContent.toLowerCase();
        const category = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || category.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        searchPublications('');
    }
}

// Refresh functionality
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Show loading state
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner"></i> Refreshing...';
            
            try {
                const response = await fetch('/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'angspe_refresh_2025'
                    }
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Show success message
                    showNotification('Data refresh started successfully!', 'success');
                    
                    // Update the freshness display to show "Refreshing..."
                    const freshnessEl = document.getElementById('data-freshness');
                    if (freshnessEl) {
                        freshnessEl.textContent = 'Refreshing...';
                        freshnessEl.title = 'Data refresh in progress';
                    }
                    
                    // Poll for completion by checking status endpoint
                    pollForCompletion();
                    
                } else {
                    showNotification(`Refresh failed: ${result.detail || result.message}`, 'error');
                    this.classList.remove('loading');
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
                }
            } catch (error) {
                showNotification('Refresh failed: Network error', 'error');
                this.classList.remove('loading');
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            }
        });
    }
}

// Poll for scraper completion
async function pollForCompletion() {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;
    
    const poll = async () => {
        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const status = await response.json();
                const lastScrape = status.last_scrape;
                
                // Check if the timestamp has been updated (indicating scraper completion)
                if (lastScrape) {
                    const scrapeDate = new Date(lastScrape);
                    const now = new Date();
                    const timeDiff = now - scrapeDate;
                    
                    // If the data is very recent (less than 2 minutes old), scraper likely completed
                    if (timeDiff < 120000) { // 2 minutes
                        // Scraper completed, update the display
                        updateDataFreshness(lastScrape, status.data_freshness);
                        
                        // Reload all data
                        loadDashboardData();
                        loadPublicationsTable();
                        
                        // Update button state
                        const refreshBtn = document.getElementById('refreshBtn');
                        if (refreshBtn) {
                            refreshBtn.innerHTML = '<i class="fas fa-check"></i> Refresh Complete';
                            refreshBtn.classList.remove('loading');
                            
                            setTimeout(() => {
                                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
                            }, 3000);
                        }
                        
                        showNotification('Data refresh completed successfully!', 'success');
                        return; // Stop polling
                    }
                }
            }
            
            attempts++;
            if (attempts < maxAttempts) {
                // Continue polling
                setTimeout(poll, 10000); // Check every 10 seconds
            } else {
                // Timeout reached
                const refreshBtn = document.getElementById('refreshBtn');
                if (refreshBtn) {
                    refreshBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Timeout';
                    refreshBtn.classList.remove('loading');
                    
                    setTimeout(() => {
                        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
                    }, 3000);
                }
                
                showNotification('Refresh timeout - data may still be updating in background', 'info');
                
                // Reload data anyway to show any updates
                loadDashboardData();
                loadPublicationsTable();
            }
        } catch (error) {
            console.error('Error polling for completion:', error);
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(poll, 10000);
            }
        }
    };
    
    // Start polling after a short delay
    setTimeout(poll, 5000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Test refresh endpoint function
function testRefreshEndpoint() {
    fetch('/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'angspe_refresh_2025'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showNotification('Test successful: ' + data.message, 'success');
        } else {
            showNotification('Test failed: ' + (data.detail || data.message), 'error');
        }
    })
    .catch(error => {
        showNotification('Test failed: ' + error.message, 'error');
    });
}

// Initialize search bar
setTimeout(addSearchBar, 100);

// Initialize refresh button
setTimeout(setupRefreshButton, 100);
