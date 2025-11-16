// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.15)';
    }
    
    lastScroll = currentScroll;
});

// Add animation on scroll for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// GitHub API Integration
async function fetchGitHubRepos() {
    const username = 'griffin-goodwin';
    const statsContainer = document.getElementById('github-stats');
    const projectsGrid = document.getElementById('projects-grid');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }
        
        const repos = await response.json();
        
        // Calculate stats
        const totalRepos = repos.length;
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        
        // Calculate language distribution
        const languageCounts = {};
        repos.forEach(repo => {
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
        });
        
        const languages = Object.entries(languageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        // Display stats
        displayGitHubStats(statsContainer, totalRepos, totalStars, totalForks, languages);
        
        // Display repos
        displayGitHubRepos(projectsGrid, repos);
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        projectsGrid.innerHTML = '<p>Unable to load GitHub repositories. Please try again later.</p>';
    }
}

function displayGitHubStats(container, totalRepos, totalStars, totalForks, languages) {
    const languageHTML = languages.map(([lang, count]) => 
        `<span class="language-badge" style="background-color: ${getLanguageColor(lang)}">${lang}</span>`
    ).join('');
    
    container.innerHTML = `
        <div class="stats-card">
            <div class="stat-item">
                <div class="stat-value">${totalRepos}</div>
                <div class="stat-label">Repositories</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${totalStars}</div>
                <div class="stat-label">Stars</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${totalForks}</div>
                <div class="stat-label">Forks</div>
            </div>
            <div class="stat-item languages">
                <div class="stat-label">Top Languages</div>
                <div class="language-badges">${languageHTML}</div>
            </div>
        </div>
    `;
}

function displayGitHubRepos(container, repos) {
    container.innerHTML = repos.map(repo => `
        <div class="project-card">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available'}</p>
            <div class="repo-meta">
                ${repo.language ? `<span class="repo-language" style="background-color: ${getLanguageColor(repo.language)}">${repo.language}</span>` : ''}
                <span class="repo-stats">
                    <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
                    <span class="repo-stat">🍴 ${repo.forks_count}</span>
                </span>
            </div>
            <a href="${repo.html_url}" class="project-link" target="_blank">View on GitHub →</a>
        </div>
    `).join('');
    
    // Apply animations to new cards
    const projectCards = container.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#239120',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'PHP': '#4F5D95',
        'Swift': '#fa7343',
        'Kotlin': '#F18E33',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Shell': '#89e051',
        'R': '#198CE7',
        'MATLAB': '#e16737',
        'Jupyter Notebook': '#DA5B0B'
    };
    return colors[language] || '#6e7681';
}

// PDF Metadata Extraction
const paperFiles = [
    'Papers/2505.10390v1.pdf',
    'Papers/2510.22801v1.pdf',
    'Papers/Goodwin_2024_ApJ_964_163.pdf',
    'Papers/Goodwin_2025_ApJ_981_200.pdf'
];

function parsePaperFromFilename(pdfPath) {
    const filename = pdfPath.split('/').pop().replace('.pdf', '');
    let title = '';
    let publicationInfo = '';
    let arxivId = '';
    
    // Check for arXiv ID pattern (e.g., 2505.10390v1)
    if (/^\d{4}\.\d{5}/.test(filename)) {
        arxivId = filename.match(/^(\d{4}\.\d{5})/)[1];
        publicationInfo = `arXiv:${arxivId}`;
        title = `Research Paper - arXiv:${arxivId}`;
    }
    // Check for publication pattern (e.g., Goodwin_2024_ApJ_964_163)
    else if (/Goodwin_\d{4}_/.test(filename)) {
        const match = filename.match(/Goodwin_(\d{4})_(\w+)_(\d+)_(\d+)/);
        if (match) {
            const [, year, journal, volume, page] = match;
            publicationInfo = `${journal} ${year}, ${volume}, ${page}`;
            // Create a more descriptive title
            if (journal === 'ApJ') {
                title = `Published in The Astrophysical Journal (${year})`;
            } else {
                title = `Published in ${journal} (${year})`;
            }
        } else {
            title = filename.replace(/_/g, ' ');
        }
    } else {
        title = filename.replace(/_/g, ' ');
        publicationInfo = filename;
    }
    
    return {
        title: title,
        authors: 'Griffin Goodwin',
        publicationInfo: publicationInfo || filename,
        arxivId: arxivId,
        filename: filename,
        path: pdfPath
    };
}

async function extractPaperMetadata(pdfPath) {
    // For GitHub Pages, PDF.js often fails due to CORS restrictions
    // So we'll primarily use filename parsing which always works
    const basicInfo = parsePaperFromFilename(pdfPath);
    
    // Only try PDF.js if we're not on GitHub Pages (localhost or local file)
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io') || 
                          window.location.hostname.includes('github.com');
    
    if (isGitHubPages || typeof pdfjsLib === 'undefined') {
        // Skip PDF.js on GitHub Pages due to CORS issues
        return basicInfo;
    }
    
    // Try to enhance with PDF.js if available (only for local development)
    try {
        const loadingTask = pdfjsLib.getDocument({
            url: pdfPath,
            httpHeaders: {},
            withCredentials: false
        });
        const pdf = await loadingTask.promise;
        const metadata = await pdf.getMetadata();
        
        // Try to get title from metadata
        let title = metadata.info?.Title || '';
        let authors = metadata.info?.Author || '';
        
        // If no title from metadata, try to extract from first page
        if (!title) {
            try {
                const page = await pdf.getPage(1);
                const textContent = await page.getTextContent();
                const text = textContent.items.map(item => item.str).join(' ');
                const lines = text.split('\n').filter(line => line.trim());
                if (lines.length > 0) {
                    title = lines[0].substring(0, 200); // First line, max 200 chars
                }
            } catch (e) {
                console.warn('Could not extract text from PDF:', e);
            }
        }
        
        return {
            title: title || basicInfo.title,
            authors: authors || basicInfo.authors,
            publicationInfo: basicInfo.publicationInfo,
            arxivId: basicInfo.arxivId,
            filename: basicInfo.filename,
            path: pdfPath
        };
    } catch (error) {
        console.warn(`Could not extract metadata from ${pdfPath}, using filename parsing:`, error);
        // Return basic info from filename parsing
        return basicInfo;
    }
}

async function loadPapers() {
    const papersGrid = document.getElementById('papers-grid');
    
    if (!papersGrid) {
        console.error('Papers grid element not found');
        return;
    }
    
    // Check if we're on GitHub Pages - use simpler, faster loading
    const isGitHubPages = window.location.hostname.includes('github.io') || 
                          window.location.hostname.includes('github.com');
    
    try {
        let papers;
        
        if (isGitHubPages) {
            // On GitHub Pages, skip PDF.js and use filename parsing directly (faster, no CORS issues)
            papers = paperFiles.map(file => parsePaperFromFilename(file));
        } else {
            // Local development - try PDF.js with timeout
            const loadPromises = paperFiles.map(file => 
                Promise.race([
                    extractPaperMetadata(file),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 3000)
                    )
                ]).catch(() => parsePaperFromFilename(file))
            );
            papers = await Promise.all(loadPromises);
        }
        
        if (papers.length === 0) {
            papersGrid.innerHTML = '<p>No papers found.</p>';
            return;
        }
        
        papersGrid.innerHTML = papers.map(paper => `
            <div class="paper-card">
                <h3>${paper.title}</h3>
                <p class="paper-authors">${paper.authors}</p>
                <p class="paper-publication">${paper.publicationInfo}</p>
                <div class="paper-links">
                    <a href="${paper.path}" class="paper-link" target="_blank">View PDF</a>
                    <a href="${paper.path}" class="paper-link" download>Download</a>
                </div>
            </div>
        `).join('');
        
        // Apply animations to paper cards
        const paperCards = papersGrid.querySelectorAll('.paper-card');
        paperCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    } catch (error) {
        console.error('Error loading papers:', error);
        // Final fallback: show papers using filename parsing only
        const papers = paperFiles.map(file => parsePaperFromFilename(file));
        papersGrid.innerHTML = papers.map(paper => `
            <div class="paper-card">
                <h3>${paper.title}</h3>
                <p class="paper-authors">${paper.authors}</p>
                <p class="paper-publication">${paper.publicationInfo}</p>
                <div class="paper-links">
                    <a href="${paper.path}" class="paper-link" target="_blank">View PDF</a>
                    <a href="${paper.path}" class="paper-link" download>Download</a>
                </div>
            </div>
        `).join('');
        
        // Apply animations
        const paperCards = papersGrid.querySelectorAll('.paper-card');
        paperCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }
}

// Space Weather API Integration
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

let currentProxyIndex = 0;

async function fetchWithProxy(url, proxyIndex = 0) {
    const proxy = CORS_PROXIES[proxyIndex % CORS_PROXIES.length];
    let fullUrl;
    
    if (proxy.includes('allorigins')) {
        fullUrl = `${proxy}${encodeURIComponent(url)}`;
    } else if (proxy.includes('codetabs')) {
        fullUrl = `${proxy}${encodeURIComponent(url)}`;
    } else {
        fullUrl = `${proxy}${url}`;
    }
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Get response as text first to check content type
    const text = await response.text();
    
    // Check if we got HTML instead of JSON
    if (text.trim().startsWith('<')) {
        throw new Error('Received HTML instead of JSON. API may be unavailable.');
    }
    
    // Try to parse as JSON
    try {
        return JSON.parse(text);
    } catch (e) {
        throw new Error('Invalid JSON response: ' + e.message);
    }
}

async function fetchSpaceWeather() {
    const container = document.getElementById('spaceweather-content');
    
    if (!container) {
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="spaceweather-loading">Loading space weather data...</div>';
    
    try {
        let latestFlare = null;
        let flareForecast = null;
        
        // Fetch latest flare
        for (let i = 0; i < CORS_PROXIES.length; i++) {
            try {
                const flareUrl = 'https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json';
                latestFlare = await fetchWithProxy(flareUrl, i);
                break;
            } catch (e) {
                console.warn(`Proxy ${i} failed for latest flare:`, e);
            }
        }
        
        // Fetch flare forecast
        for (let i = 0; i < CORS_PROXIES.length; i++) {
            try {
                const forecastUrl = 'https://services.swpc.noaa.gov/json/solar_probabilities.json';
                flareForecast = await fetchWithProxy(forecastUrl, i);
                break;
            } catch (e) {
                console.warn(`Proxy ${i} failed for flare forecast:`, e);
            }
        }
        
        // Display the data (alerts removed)
        displaySpaceWeather(container, null, latestFlare, flareForecast);
        
    } catch (error) {
        console.error('Error fetching space weather:', error);
        // Show fallback data instead of error
        displaySpaceWeather(container, null, null, null, true);
    }
}

function getSDOAIAImageUrl(flareTime) {
    // Get SDO AIA image from sdo.gsfc.nasa.gov
    // Use latest available image or construct URL based on time
    if (!flareTime) {
        // Return latest image if no time provided
        return 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg';
    }
    
    try {
        const date = new Date(flareTime);
        // SDO images are typically available hourly
        // Use the latest image URL format from SDO
        // For specific times, we can use the latest image as fallback
        return 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg';
    } catch (e) {
        console.warn('Error constructing SDO image URL:', e);
        return 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg';
    }
}

function displaySpaceWeather(container, alerts, latestFlare, flareForecast, showFallback = false) {
    // Format time helper
    const formatTime = (timeStr) => {
        if (!timeStr) return 'N/A';
        try {
            const date = new Date(timeStr);
            return date.toLocaleString();
        } catch (e) {
            return timeStr;
        }
    };
    
    // Parse latest flare - using actual API field names
    let flareClass = 'N/A';
    let flareBeginTime = 'N/A';
    let flarePeakTime = 'N/A';
    let flareEndTime = 'N/A';
    let flareMaxFlux = 'N/A';
    let sdoImageUrl = getSDOAIAImageUrl(); // Always show current sun image
    
    if (!showFallback && latestFlare) {
        let flare = null;
        if (Array.isArray(latestFlare) && latestFlare.length > 0) {
            flare = latestFlare[0]; // Most recent flare
        } else if (typeof latestFlare === 'object') {
            flare = latestFlare;
        }
        
        if (flare) {
            // Use actual field names from the API
            flareClass = flare.current_class || flare.max_class || flare.begin_class || 
                        flare.end_class || 'N/A';
            flareBeginTime = formatTime(flare.begin_time);
            flarePeakTime = formatTime(flare.max_time);
            flareEndTime = formatTime(flare.end_time);
            flareMaxFlux = flare.max_xrlong || flare.current_int_xrlong || 'N/A';
            
            // Format flux value if it's a number
            if (flareMaxFlux !== 'N/A' && typeof flareMaxFlux === 'number') {
                flareMaxFlux = flareMaxFlux.toExponential(2) + ' W/m²';
            }
        }
    }
    
    // Parse flare forecast - using actual API field names
    let forecastX = 'N/A';
    let forecastM = 'N/A';
    let forecastC = 'N/A';
    let forecastTime = 'N/A';
    
    if (!showFallback && flareForecast) {
        if (Array.isArray(flareForecast) && flareForecast.length > 0) {
            const forecast = flareForecast[0]; // Most recent forecast (first in array)
            // Use _1_day fields for 1-day forecast probabilities
            forecastX = forecast.x_class_1_day !== undefined ? forecast.x_class_1_day + '%' : 'N/A';
            forecastM = forecast.m_class_1_day !== undefined ? forecast.m_class_1_day + '%' : 'N/A';
            forecastC = forecast.c_class_1_day !== undefined ? forecast.c_class_1_day + '%' : 'N/A';
            forecastTime = formatTime(forecast.date);
        } else if (typeof flareForecast === 'object') {
            forecastX = flareForecast.x_class_1_day !== undefined ? flareForecast.x_class_1_day + '%' : 'N/A';
            forecastM = flareForecast.m_class_1_day !== undefined ? flareForecast.m_class_1_day + '%' : 'N/A';
            forecastC = flareForecast.c_class_1_day !== undefined ? flareForecast.c_class_1_day + '%' : 'N/A';
            forecastTime = formatTime(flareForecast.date);
        }
    }
    
    // Show fallback message if API failed
    const fallbackMessage = showFallback ? `
        <div class="spaceweather-warning">
            <p>⚠️ Live data temporarily unavailable. Showing placeholder information.</p>
            <p>Please check back later or visit <a href="https://www.swpc.noaa.gov" target="_blank">NOAA SWPC</a> directly.</p>
        </div>
    ` : '';
    
    container.innerHTML = `
        ${fallbackMessage}
        <div class="spaceweather-grid">
            <div class="spaceweather-card">
                <h3>Latest Flare Event</h3>
                <div class="spaceweather-info">
                    <div class="spaceweather-value">
                        <span class="value-large flare-class-${flareClass.toLowerCase().charAt(0)}">${flareClass}</span>
                    </div>
                    ${flareMaxFlux !== 'N/A' ? `<p class="spaceweather-class">Max Flux: <strong>${flareMaxFlux}</strong></p>` : ''}
                    <p class="spaceweather-time">Begin: ${flareBeginTime}</p>
                    ${flarePeakTime !== 'N/A' ? `<p class="spaceweather-time">Peak: ${flarePeakTime}</p>` : ''}
                    ${flareEndTime !== 'N/A' ? `<p class="spaceweather-time">End: ${flareEndTime}</p>` : ''}
                </div>
            </div>
            
            <div class="spaceweather-card">
                <h3>The Sun Right Now</h3>
                <div class="spaceweather-info">
                    <div class="sdo-image-container">
                        <a href="https://sdo.gsfc.nasa.gov" target="_blank" title="View on SDO website">
                            <img src="${sdoImageUrl}" alt="SDO AIA 193Å Image - The Sun Right Now" class="sdo-image" 
                                 onerror="this.onerror=null; this.src='https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg';">
                        </a>
                        <p class="sdo-image-note">SDO AIA 193Å</p>
                        <p class="sdo-image-note">Click to view on SDO website</p>
                    </div>
                </div>
            </div>
            
            <div class="spaceweather-card">
                <h3>Flare Forecast</h3>
                <div class="spaceweather-info">
                    <p class="spaceweather-class">X-Class Probability: <strong>${forecastX}</strong></p>
                    <p class="spaceweather-class">M-Class Probability: <strong>${forecastM}</strong></p>
                    <p class="spaceweather-class">C-Class Probability: <strong>${forecastC}</strong></p>
                    <p class="spaceweather-time">Forecast Time: ${forecastTime}</p>
                </div>
            </div>
        </div>
        <div class="spaceweather-controls">
            <button onclick="fetchSpaceWeather()" class="refresh-button">Refresh Data</button>
            <p class="auto-refresh-note">Data auto-refreshes every 5 minutes</p>
        </div>
    `;
    
    // Apply animations to cards
    const cards = container.querySelectorAll('.spaceweather-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Auto-refresh space weather data every 5 minutes
let spaceWeatherInterval = null;

function startSpaceWeatherAutoRefresh() {
    // Clear any existing interval
    if (spaceWeatherInterval) {
        clearInterval(spaceWeatherInterval);
    }
    
    // Set up auto-refresh every 5 minutes (300000 ms)
    spaceWeatherInterval = setInterval(() => {
        fetchSpaceWeather();
    }, 300000);
}

// Observe project cards for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PDF.js worker if available
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    // Load GitHub repos immediately
    fetchGitHubRepos();
    
    // Load papers - will work even if PDF.js fails
    // Papers will always show using filename parsing as fallback
    loadPapers();
    
    // Load space weather data
    fetchSpaceWeather();
    startSpaceWeatherAutoRefresh();
    
    // Observe existing project cards (if any)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});
