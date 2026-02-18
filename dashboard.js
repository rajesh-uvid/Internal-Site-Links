// 1. Security Check
if (sessionStorage.getItem("auth") !== "true") {
    window.location.replace("index.html");
}

let allProjects = [];
let currentCategory = 'All';

const defaultImage = "assets/thinking.svg";

document.addEventListener('DOMContentLoaded', () => {
    // 0. Setup Theme
    initTheme();

    // 2. Setup Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.replace("index.html");
        });
    }

    // 3. Setup View Toggles
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const gallery = document.getElementById('gallery');

    if (gridBtn && listBtn && gallery) {
        gridBtn.addEventListener('click', () => {
            gallery.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            gallery.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }

    // 4. Setup Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterProjects(searchTerm);
        });
    }

    // 5. Load Data
    loadProjects();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('theme', target);
            updateThemeIcon(target);
        });
    }
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Simple icon swap: Sun for Dark Mode (to switch to Light), Moon for Light Mode (to switch to Dark)
    // Actually, usually you show the icon of the mode you are GOING TO or the mode you are IN?
    // Let's settle on: Show Sun if in Dark (to indicate Light is option) or Moon if in Light.
    // Wait, typical pattern:
    // Dark Mode -> Show Sun 
    // Light Mode -> Show Moon

    if (theme === 'dark') {
        btn.innerHTML = `
            <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>`;
    } else {
        btn.innerHTML = `
            <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>`;
    }
}

async function loadProjects() {
    const gallery = document.getElementById('gallery');

    try {
        const response = await fetch('assets/data.csv');
        if (!response.ok) throw new Error('Failed to load data file');

        const data = await response.text();
        const rows = parseCSV(data);

        // Start at index 1 to skip the Header row
        if (rows.length <= 1) {
            gallery.innerHTML = '<p class="loading-text">No projects found.</p>';
            return;
        }

        // Parse rows into objects
        allProjects = rows.slice(1).map(row => {
            if (row.length < 4) return null;
            const [title, link, desc, img, category] = row;
            return {
                title: title ? title.trim() : '',
                link: link ? link.trim() : '#',
                desc: desc ? desc.trim() : '',
                img: img ? img.trim() : '',
                category: category ? category.trim() : 'Uncategorized'
            };
        }).filter(item => item !== null);

        // Initial Render
        renderSidebar();
        renderProjects(allProjects);

    } catch (err) {
        console.error('Error loading projects:', err);
        gallery.innerHTML = '<p class="loading-text" style="color: var(--error)">Error loading project data. Check console for details.</p>';
    }
}

function renderSidebar() {
    const nav = document.getElementById('category-nav');
    if (!nav) return;

    // Get unique categories
    const categories = ['All', ...new Set(allProjects.map(p => p.category))].sort();

    nav.innerHTML = '';

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `nav-item ${cat === currentCategory ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => {
            // Update active state
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentCategory = cat;

            // Clear search when changing category or keep it? 
            // Let's keep search context if any, but properly combine filters
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            filterProjects(searchTerm);
        };
        nav.appendChild(btn);
    });
}

function filterProjects(searchTerm = '') {
    const filtered = allProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
            project.desc.toLowerCase().includes(searchTerm);
        const matchesCategory = currentCategory === 'All' || project.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    renderProjects(filtered);
}

function renderProjects(projects) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    if (projects.length === 0) {
        gallery.innerHTML = '<p class="loading-text">No projects found matching your criteria.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    // Default SVG Image (Encoded)
    // Removed hardcoded SVG - using global defaultImage variable defined at top

    projects.forEach((project, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${i * 0.05}s`; // Faster stagger for updates

        // Image error handler
        const imgErrorHandler = `this.onerror=null; this.src="${defaultImage}";`;

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${project.img || defaultImage}" 
                     alt="${project.title}" 
                     class="card-img" 
                     onerror='${imgErrorHandler}'>
            </div>
            <div class="card-body">
                <div>
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-desc">${project.desc}</p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.8rem; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:4px;">
                        ${project.category}
                    </span>
                    <a href="${project.link}" target="_blank" class="btn-link">
                        Open Site
                    </a>
                </div>
            </div>
        `;
        fragment.appendChild(card);
    });

    gallery.appendChild(fragment);
}

// Better CSV Parser specifically handling quotes
function parseCSV(str) {
    const arr = [];
    let quote = false;
    let col = 0, row = 0;

    // Initialize first row/col
    arr[row] = [];
    arr[row][col] = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const nextChar = str[i + 1];

        // Handle escaped quotes
        if (char === '"' && quote && nextChar === '"') {
            arr[row][col] += char;
            i++;
            continue;
        }

        // Handle quotes
        if (char === '"') {
            quote = !quote;
            continue;
        }

        // Handle Helper separator
        if (char === ',' && !quote) {
            col++;
            // Initialize new column
            arr[row][col] = '';
            continue;
        }

        // Handle Line Breaks
        if ((char === '\r' || char === '\n') && !quote) {
            // Traverse past newline
            if (char === '\r' && nextChar === '\n') i++;

            // If we are at the end of the string, don't create a new empty row
            if (i >= str.length - 1) break;

            row++;
            col = 0;
            arr[row] = [];
            arr[row][col] = '';
            continue;
        }

        // Add character
        arr[row][col] += char;
    }
    return arr;
}
