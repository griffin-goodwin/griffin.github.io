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

async function extractPaperMetadata(pdfPath) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;
        const metadata = await pdf.getMetadata();
        
        // Try to get title from metadata
        let title = metadata.info?.Title || '';
        let authors = metadata.info?.Author || '';
        
        // Parse filename for additional info
        const filename = pdfPath.split('/').pop().replace('.pdf', '');
        let publicationInfo = '';
        let arxivId = '';
        
        // Check for arXiv ID pattern (e.g., 2505.10390v1)
        if (/^\d{4}\.\d{5}/.test(filename)) {
            arxivId = filename.match(/^(\d{4}\.\d{5})/)[1];
            publicationInfo = `arXiv:${arxivId}`;
        }
        // Check for publication pattern (e.g., Goodwin_2024_ApJ_964_163)
        else if (/Goodwin_\d{4}_/.test(filename)) {
            const match = filename.match(/Goodwin_(\d{4})_(\w+)_(\d+)_(\d+)/);
            if (match) {
                const [, year, journal, volume, page] = match;
                publicationInfo = `${journal} ${year}, ${volume}, ${page}`;
            }
        }
        
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
            title: title || filename.replace(/_/g, ' '),
            authors: authors || 'Griffin Goodwin',
            publicationInfo: publicationInfo || filename,
            arxivId: arxivId,
            filename: filename,
            path: pdfPath
        };
    } catch (error) {
        console.error(`Error extracting metadata from ${pdfPath}:`, error);
        // Fallback to filename parsing
        const filename = pdfPath.split('/').pop().replace('.pdf', '');
        let publicationInfo = '';
        let arxivId = '';
        
        if (/^\d{4}\.\d{5}/.test(filename)) {
            arxivId = filename.match(/^(\d{4}\.\d{5})/)[1];
            publicationInfo = `arXiv:${arxivId}`;
        } else if (/Goodwin_\d{4}_/.test(filename)) {
            const match = filename.match(/Goodwin_(\d{4})_(\w+)_(\d+)_(\d+)/);
            if (match) {
                const [, year, journal, volume, page] = match;
                publicationInfo = `${journal} ${year}, ${volume}, ${page}`;
            }
        }
        
        return {
            title: filename.replace(/_/g, ' '),
            authors: 'Griffin Goodwin',
            publicationInfo: publicationInfo || filename,
            arxivId: arxivId,
            filename: filename,
            path: pdfPath
        };
    }
}

async function loadPapers() {
    const papersGrid = document.getElementById('papers-grid');
    
    try {
        const papers = await Promise.all(
            paperFiles.map(file => extractPaperMetadata(file))
        );
        
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
        papersGrid.innerHTML = '<p>Unable to load papers. Please try again later.</p>';
    }
}

// Observe project cards for animation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    
    // Load GitHub repos immediately
    fetchGitHubRepos();
    
    // Wait for PDF.js to be fully loaded before loading papers
    if (typeof pdfjsLib !== 'undefined') {
        loadPapers();
    } else {
        // Retry after a short delay if PDF.js isn't loaded yet
        setTimeout(() => {
            if (typeof pdfjsLib !== 'undefined') {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                loadPapers();
            } else {
                console.error('PDF.js library not loaded');
                document.getElementById('papers-grid').innerHTML = '<p>Unable to load PDF library. Please refresh the page.</p>';
            }
        }, 500);
    }
    
    // Observe existing project cards (if any)
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});
