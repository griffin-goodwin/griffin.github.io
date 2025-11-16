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

// PDF Metadata - Hardcoded paper information
// Note: Abstracts and full author lists should be extracted from PDFs and updated here
const paperData = [
    {
        path: 'Papers/2510.22801v1.pdf',
        title: 'FOXES: A Framework For Operational X-ray Emission Synthesis',
        authors: 'Griffin T. Goodwin, Jayant Biradar, Alison J. March, Christoph Schirninger, Robert Jarolim, Angelos Vourlidas, Lorien Pratt',
        publicationInfo: 'arXiv:2510.22801',
        abstract: `Understanding solar flares is critical for predicting space weather, as their activity shapes how the Sun influences Earth and its environment. The development of reliable forecasting methodologies of these events depends on robust flare catalogs, but current methods are limited to flare classification using integrated soft X-ray emission that are available only from Earth’s perspective. This reduces accuracy in pinpointing the location and strength of farside flares and their connection to geoeffective events. In this work, we introduce a Vision Transformer (ViT)-based approach that translates Extreme Ultraviolet (EUV) observations into soft x-ray flux while also setting the groundwork for estimating flare locations in the future. The model achieves accurate flux predictions across flare classes using quantitative metrics. This paves the way for EUV-based flare detection to be extended beyond Earth’s line of sight, which allows for a more comprehensive and complete solar flare catalog.`
    },
    {
        path: 'Papers/Goodwin_2025_ApJ_981_200.pdf',
        title: 'The Impacts of Magnetogram Projection Effects on Solar Flare Forecasting',
        authors: 'Griffin T. Goodwin, Viachyslav M. Sadykov, and Petrus C. Martens',
        publicationInfo: 'ApJ 2025, 981, 200',
        abstract: 'This work explores the impacts of magnetogram projection effects on machine-learning-based solar flare forecasting models. Utilizing a methodology proposed by D. A. Falconer et al., we correct for projection effects present in Georgia State University’s Space Weather Analytics for Solar Flares benchmark data set. We then train and test a support vector machine classifier on the corrected and uncorrected data, comparing differences in performance. Additionally, we provide insight into several other methodologies that mitigate projection effects, such as stacking ensemble classifiers and active region location-informed models. Our analysis shows that data corrections slightly increase both the true-positive (correctly predicted flaring samples) and false-positive (nonflaring samples predicted as flaring) prediction rates, averaging a few percent. Similarly, changes in performance metrics are minimal for the stacking ensemble and location-based model. This suggests that a more complicated correction methodology may be needed to see improvements. It may also indicate inherent limitations when using magnetogram data for flare forecasting.'
    },
    {
        path: 'Papers/Goodwin_2024_ApJ_964_163.pdf',
        title: 'Investigating Performance Trends of Simulated Real-time Solar Flare Predictions: The Impacts of Training Windows, Data Volumes, and the Solar Cycle',
        authors: 'Griffin T. Goodwin, Viachyslav M. Sadykov, and Petrus C. Martens',
        publicationInfo: 'ApJ 2024, 964, 163',
        abstract: 'This study explores the behavior of machine-learning-based flare forecasting models deployed in a simulated operational environment. Using Georgia State University’s Space Weather Analytics for Solar Flares benchmark data set, we examine the impacts of training methodology and the solar cycle on decision tree, support vector machine, and multilayer perceptron performance. We implement our classifiers using three temporal training windows: stationary, rolling, and expanding. The stationary window trains models using a single set of data available before the first forecasting instance, which remains constant throughout the solar cycle. The rolling window trains models using data from a constant time interval before the forecasting instance, which moves with the solar cycle. Finally, the expanding window trains models using all available data before the forecasting instance. For each window, a number of input features (1, 5, 10, 25, 50, and 120) and temporal sizes (5, 8, 11, 14, 17, and 20 months) were tested. To our surprise, we found that, for a window of 20 months, skill scores were comparable regardless of the window type, feature count, and classifier selected. Furthermore, reducing the size of this window only marginally decreased stationary and rolling window performance. This implies that, given enough data, a stationary window can be chosen over other window types, eliminating the need for model retraining. Finally, a moderately strong positive correlation was found to exist between a model’s false-positive rate and the solar X-ray background flux. This suggests that the solar cycle phase has a considerable influence on forecasting.'
    },
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
        abstract: '',
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
        
        // Try to get title and authors from metadata
        let title = metadata.info?.Title || '';
        let authors = metadata.info?.Author || '';
        let abstract = '';
        
        // Extract text from first few pages to get title, authors, and abstract
        try {
            const numPages = Math.min(pdf.numPages, 3); // Check first 3 pages
            let fullText = '';
            
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            const lines = fullText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            
            // Extract title (usually first substantial line)
            if (!title && lines.length > 0) {
                // Find the first line that looks like a title (not too short, not all caps unless short)
                for (let i = 0; i < Math.min(10, lines.length); i++) {
                    const line = lines[i];
                    if (line.length > 20 && line.length < 300) {
                        title = line;
                        break;
                    }
                }
            }
            
            // Extract authors (usually after title, before abstract)
            if (!authors || authors === 'Griffin Goodwin') {
                // Look for author patterns: lines with "and", commas, or email patterns
                const authorPatterns = [
                    /^[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+(?:, [A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)*(?: and [A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)?/,
                    /^[A-Z][a-z]+ [A-Z][a-z]+(?:, [A-Z][a-z]+ [A-Z][a-z]+)*(?: and [A-Z][a-z]+ [A-Z][a-z]+)?/,
                ];
                
                // Find title index
                let titleIndex = -1;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] === title || lines[i].includes(title.substring(0, 20))) {
                        titleIndex = i;
                        break;
                    }
                }
                
                // Look for authors after title
                for (let i = (titleIndex >= 0 ? titleIndex + 1 : 0); i < Math.min(titleIndex + 10, lines.length); i++) {
                    const line = lines[i];
                    // Skip common non-author lines
                    if (line.toLowerCase().includes('abstract') || 
                        line.toLowerCase().includes('keywords') ||
                        line.toLowerCase().includes('introduction') ||
                        line.length > 200) {
                        break;
                    }
                    // Check if line looks like authors
                    if (line.includes(',') || line.includes(' and ') || 
                        (line.split(' ').length >= 2 && line.split(' ').length <= 15)) {
                        // Check if it contains email (common in author lines)
                        if (line.includes('@') || line.match(/[A-Z][a-z]+ [A-Z]\. [A-Z]/)) {
                            authors = line;
                            break;
                        } else if (authors === 'Griffin Goodwin' && line.length > 10 && line.length < 200) {
                            authors = line;
                        }
                    }
                }
            }
            
            // Extract abstract
            // Look for "Abstract" keyword
            const abstractKeywords = ['Abstract', 'ABSTRACT', 'Summary'];
            let abstractStartIndex = -1;
            
            for (let i = 0; i < lines.length; i++) {
                if (abstractKeywords.some(keyword => lines[i].toLowerCase().includes(keyword.toLowerCase()))) {
                    abstractStartIndex = i;
                    break;
                }
            }
            
            if (abstractStartIndex >= 0) {
                // Collect text after "Abstract" until we hit another section
                const sectionKeywords = ['Introduction', 'Keywords', '1.', 'I.', 'Background'];
                let abstractLines = [];
                
                for (let i = abstractStartIndex + 1; i < lines.length; i++) {
                    const line = lines[i];
                    // Stop if we hit another section
                    if (sectionKeywords.some(keyword => line.toLowerCase().startsWith(keyword.toLowerCase()))) {
                        break;
                    }
                    // Stop if line looks like a section header (all caps, short)
                    if (line.length < 50 && line === line.toUpperCase() && line.length > 3) {
                        break;
                    }
                    abstractLines.push(line);
                }
                
                abstract = abstractLines.join(' ').trim();
                // Limit abstract length
                if (abstract.length > 1000) {
                    abstract = abstract.substring(0, 1000) + '...';
                }
            }
            
        } catch (e) {
            console.warn('Could not extract text from PDF:', e);
        }
        
        return {
            title: title || basicInfo.title,
            authors: authors || basicInfo.authors,
            publicationInfo: basicInfo.publicationInfo,
            abstract: abstract || '',
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
    
    try {
        // Use hardcoded paper data
        const papers = paperData;
        
        if (papers.length === 0) {
            papersGrid.innerHTML = '<p>No papers found.</p>';
            return;
        }
        
        papersGrid.innerHTML = papers.map((paper, index) => {
            const abstractId = `abstract-${index}`;
            const truncatedLength = 200;
            const hasAbstract = paper.abstract && paper.abstract.length > 0;
            const needsTruncation = hasAbstract && paper.abstract.length > truncatedLength;
            const truncatedAbstract = needsTruncation ? paper.abstract.substring(0, truncatedLength) + '...' : paper.abstract;
            
            return `
            <div class="paper-card">
                <h3>${paper.title}</h3>
                <p class="paper-authors">${paper.authors}</p>
                <p class="paper-publication">${paper.publicationInfo}</p>
                ${hasAbstract ? `
                    <div class="paper-abstract" id="${abstractId}">
                        <strong>Abstract:</strong> 
                        <span class="abstract-text">${truncatedAbstract}</span>
                        ${needsTruncation ? `
                            <span class="abstract-full" style="display: none;">${paper.abstract}</span>
                            <button class="abstract-toggle" onclick="toggleAbstract('${abstractId}')">Read more</button>
                        ` : ''}
                    </div>
                ` : ''}
                <div class="paper-links">
                    <a href="${paper.path}" class="paper-link" target="_blank">View PDF</a>
                    <a href="${paper.path}" class="paper-link" download>Download</a>
                </div>
            </div>
        `}).join('');
        
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
        papersGrid.innerHTML = '<p>Error loading papers. Please try again later.</p>';
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
        let xrayData = null;
        
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

function drawSXRChart(canvasId, xrayData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !xrayData || !Array.isArray(xrayData) || xrayData.length === 0) {
        return;
    }
    
    // Make canvas responsive
    const container = canvas.parentElement;
    const containerWidth = container ? container.clientWidth - 40 : 600;
    const aspectRatio = 600 / 200; // Original aspect ratio
    canvas.width = containerWidth;
    canvas.height = containerWidth / aspectRatio;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Get last 6 hours of data (or all if less)
    const now = Date.now();
    const sixHoursAgo = now - (6 * 60 * 60 * 1000);
    const recentData = xrayData
        .filter(point => {
            const pointTime = new Date(point.time_tag || point.time).getTime();
            return pointTime >= sixHoursAgo;
        })
        .slice(-100); // Limit to last 100 points for performance
    
    if (recentData.length === 0) {
        return;
    }
    
    // Extract flux values (try different field names)
    const fluxData = recentData.map(point => {
        const flux = point.flux || point.flux_avg || point.xrsa || point.xrsb || 0;
        return typeof flux === 'number' ? flux : parseFloat(flux) || 0;
    });
    
    const times = recentData.map(point => new Date(point.time_tag || point.time).getTime());
    
    // Find min/max for scaling
    const minFlux = Math.min(...fluxData.filter(f => f > 0));
    const maxFlux = Math.max(...fluxData);
    
    // Use log scale for better visualization
    const logMin = Math.log10(Math.max(minFlux, 1e-8));
    const logMax = Math.log10(Math.max(maxFlux, 1e-8));
    const logRange = logMax - logMin;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw data line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    recentData.forEach((point, index) => {
        const flux = fluxData[index];
        if (flux > 0) {
            const logFlux = Math.log10(flux);
            const normalizedLog = (logFlux - logMin) / logRange;
            const x = padding + (chartWidth / (recentData.length - 1)) * index;
            const y = height - padding - (normalizedLog * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    });
    ctx.stroke();
    
    // Draw flare thresholds
    const thresholds = [
        { value: 1e-7, label: 'B', color: '#3498db' },
        { value: 1e-6, label: 'C', color: '#f1c40f' },
        { value: 1e-5, label: 'M', color: '#f39c12' },
        { value: 1e-4, label: 'X', color: '#e74c3c' }
    ];
    
    thresholds.forEach(threshold => {
        if (threshold.value <= maxFlux) {
            const logThreshold = Math.log10(threshold.value);
            const normalizedLog = (logThreshold - logMin) / logRange;
            const y = height - padding - (normalizedLog * chartHeight);
            
            ctx.strokeStyle = threshold.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Label
            ctx.fillStyle = threshold.color;
            ctx.font = '10px sans-serif';
            ctx.fillText(threshold.label, padding - 15, y + 3);
        }
    });
    
    // Draw time labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const timeLabels = 5;
    for (let i = 0; i <= timeLabels; i++) {
        const index = Math.floor((recentData.length - 1) * (i / timeLabels));
        if (index < recentData.length) {
            const time = new Date(times[index]);
            const hours = time.getHours();
            const minutes = time.getMinutes();
            const label = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            const x = padding + (chartWidth / timeLabels) * i;
            ctx.fillText(label, x, height - padding + 20);
        }
    }
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText('X-Ray Flux (W/m²)', 0, 0);
    ctx.restore();
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
                <h3>SXR Flux Overview</h3>
                <div class="spaceweather-info">
                    <img id="sxr-overview-img" src="" alt="Space Weather X-Ray Overview" class="sxr-overview-image" 
                         onclick="openSXRModal(this.src || 'https://services.swpc.noaa.gov/images/swx-overview-small.gif')"
                         style="cursor: pointer; display: none;">
                    <div class="sxr-image-loading" style="text-align: center; padding: 2rem; color: #888;">Loading image...</div>
                    <p class="sxr-image-error" style="display:none; font-size:0.875rem; color:#888; text-align: center; padding: 1rem;">Image unavailable. <a href="https://services.swpc.noaa.gov/images/swx-overview-small.gif" target="_blank" style="color: #3498db;">View directly</a></p>
                </div>
            </div>
            
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
    
    // Load SXR overview image with CORS proxy fallback
    loadSXRImage();
}

// Load SXR overview image with fallback
async function loadSXRImage() {
    const img = document.getElementById('sxr-overview-img');
    const loadingDiv = document.querySelector('.sxr-image-loading');
    const errorDiv = document.querySelector('.sxr-image-error');
    
    if (!img) return;
    
    const imageUrl = 'https://services.swpc.noaa.gov/images/swx-overview-small.gif';
    
    // Try loading directly first
    img.onload = function() {
        img.style.display = 'block';
        if (loadingDiv) loadingDiv.style.display = 'none';
    };
    
    img.onerror = function() {
        // If direct load fails, try using a proxy
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(imageUrl);
        const proxyImg = new Image();
        
        proxyImg.onload = function() {
            img.src = proxyUrl;
            img.style.display = 'block';
            if (loadingDiv) loadingDiv.style.display = 'none';
        };
        
        proxyImg.onerror = function() {
            // Try another proxy
            const proxyUrl2 = 'https://corsproxy.io/?' + encodeURIComponent(imageUrl);
            const proxyImg2 = new Image();
            
            proxyImg2.onload = function() {
                img.src = proxyUrl2;
                img.style.display = 'block';
                if (loadingDiv) loadingDiv.style.display = 'none';
            };
            
            proxyImg2.onerror = function() {
                // All attempts failed
                if (loadingDiv) loadingDiv.style.display = 'none';
                if (errorDiv) errorDiv.style.display = 'block';
            };
            
            proxyImg2.src = proxyUrl2;
        };
        
        proxyImg.src = proxyUrl;
    };
    
    // Start loading
    img.src = imageUrl;
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

// Open modal for SXR overview image
function openSXRModal(imageSrc) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'sxr-modal-overlay';
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeSXRModal();
        }
    };
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'sxr-modal-content';
    modalContent.onclick = function(e) {
        e.stopPropagation();
    };
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'sxr-modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeSXRModal;
    
    // Create image
    const img = document.createElement('img');
    img.src = imageSrc.replace('swx-overview-small.gif', 'swx-overview.gif'); // Use larger version if available
    img.alt = 'Space Weather X-Ray Overview - Full Size';
    img.className = 'sxr-modal-image';
    img.onerror = function() {
        // Fallback to small version if large version doesn't exist
        this.src = imageSrc;
    };
    
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(img);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal
function closeSXRModal() {
    const modal = document.querySelector('.sxr-modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSXRModal();
    }
});

// Toggle abstract expand/collapse
function toggleAbstract(abstractId) {
    const abstractDiv = document.getElementById(abstractId);
    if (!abstractDiv) return;
    
    const abstractText = abstractDiv.querySelector('.abstract-text');
    const abstractFull = abstractDiv.querySelector('.abstract-full');
    const toggleButton = abstractDiv.querySelector('.abstract-toggle');
    
    if (!abstractFull || !toggleButton) return;
    
    const isExpanded = abstractFull.style.display !== 'none';
    
    if (isExpanded) {
        // Collapse
        abstractText.style.display = 'inline';
        abstractFull.style.display = 'none';
        toggleButton.textContent = 'Read more';
    } else {
        // Expand
        abstractText.style.display = 'none';
        abstractFull.style.display = 'inline';
        toggleButton.textContent = 'Read less';
    }
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
