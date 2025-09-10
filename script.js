// Demo MVP: Card-based document viewer with categories, search (no upload, no backend)
const filesData = [
    {
        name: "Organisation & Module- 3rd sem",
        type: "pdf",
        url: "https://drive.google.com/drive/folders/1gPKn6zLmMOguZPBraZZCmbkhdcdvDLPR",
        date: "2023-12-15",
        size: "2.4 MB",
        categories: ["Reports"],
        thumb: "https://drive.google.com/drive/folders/1gPKn6zLmMOguZPBraZZCmbkhdcdvDLPR"
    },
    {
        name: "CO_LAB_FILES",
        type: "FOLDER",
        url: "https://drive.google.com/drive/folders/1Q6R00k1fy6CPn4Wo1Ib92MsuCmlR8HWB?usp=sharing",
        date: "2025-09-02",
        size: "1.2 MB",
        categories: ["Proposals"],
        thumb: "https://drive.google.com/drive/folders/1Q6R00k1fy6CPn4Wo1Ib92MsuCmlR8HWB?usp=sharing"
    },
    
    {
        name: "DSA_LAB_CODES_FILE",
        type: "pdf",
        url: "https://drive.google.com/drive/folders/1pCzVr3MQ56pWM1QvTkprvv3AjEiCmx-h?usp=drive_link",
        date: "2023-11-28",
        size: "1.2 MB",
        categories: ["Chemistry"],
        thumb: "https://drive.google.com/drive/folders/1pCzVr3MQ56pWM1QvTkprvv3AjEiCmx-h?usp=drive_link"
    },
    
    {
        name: "Eng--Org",
        type: "pdf",
        url: "assets/English/English .pdf",
        date: "2023-11-28",
        size: "1.2 MB",
        categories: ["English"],
        thumb: "assets/English/English .pdf"
    },
    
    
    {
        name: "Math--Org",
        type: "pdf",
        url: "assets/M201/Mathematics - IIA .pdf",
        date: "2023-11-28",
        size: "1.2 MB",
        categories: ["Mathematics"],
        thumb: "assets/M201/Mathematics - IIA .pdf"
    },
    
    
    
    {
        name: "pps--Org",
        type: "pdf",
        url: "assets/Cp/Programming for problem solving .pdf",
        date: "2023-11-28",
        size: "1.2 MB",
        categories: ["C-Programming"],
        thumb: "assets/Cp/Programming for problem solving .pdf"
    },

    {
        name: "Team Photo",
        type: "image",
        url: "assets/M201/fil.jpg",
        date: "2023-10-12",
        size: "3.5 MB",
        categories: ["Mathematics"],
        thumb: "assets/M201/fil.jpg"
    },
    {
        name: "Team Photo",
        type: "image",
        url: "assets/image.png",
        date: "2023-10-12",
        size: "3.5 MB",
        categories: ["Photos"],
        thumb: "assets/image.png"
    },
    {
        name: "Product Design",
        type: "image",
        url: "assets/image1.png",
        date: "2023-11-05",
        size: "2.8 MB",
        categories: ["Designs"],
        thumb: "assets/image1.png"
    }
];

const categories = ["All", "C-Programming", "Mathematics", "English", "Chemistry"];

let files = [...filesData];
let filteredFiles = [...files];
let selectedCategory = "All";
let searchTerm = "";

function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

function renderCategories() {
    const catBar = document.createElement('div');
    catBar.className = 'category-bar';
    catBar.innerHTML = categories.map(cat =>
        `<button class="cat-btn${cat === selectedCategory ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');
    return catBar;
}

function renderCards() {
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    if (filteredFiles.length === 0) {
        grid.innerHTML = `
            <div class="empty-message">
                No documents found matching your criteria.
                <div style="font-size: 1rem; margin-top: 12px; opacity: 0.8;">Try adjusting your search or category filter.</div>
            </div>`;
        return grid;
    }
    filteredFiles.forEach((file, idx) => {
        const fileIcon = getFileIcon(file.type);
        // Ensure proper text wrapping for long names
        const displayName = file.name.length > 45 ? file.name.substring(0, 42) + '...' : file.name;
        grid.innerHTML += `
        <div class="doc-card">
            <div class="thumb-wrap">
                <span class="file-type">${file.type.toUpperCase()}</span>
            </div>
            <div class="doc-info">
                <div class="doc-title" title="${file.name}">${file.name}</div>
                <div class="doc-meta">
                    <span>${formatDate(file.date)}</span> • <span>${file.size}</span>
                </div>
                <div class="doc-tags">
                    ${file.categories.map(cat => `<span class="doc-tag" title="${cat}">${cat}</span>`).join('')}
                </div>
                <div class="doc-actions">
                    <button class="view-btn" data-idx="${idx}" title="View ${file.name}">
                        👁️ View
                    </button>
                    <a class="download-btn" href="${file.url}" download="${file.name}" title="Download ${file.name}">
                        ⬇️ Get
                    </a>
                </div>
            </div>
        </div>
        `;
    });
    return grid;
}

function getFileIcon(type) {
    const icons = {
        'pdf': '📄',
        'image': '🖼️',
        'doc': '📝',
        'docx': '📝',
        'txt': '📋',
        'default': '📁'
    };
    return icons[type] || icons['default'];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function renderUI() {
    const container = $('.container');
    container.innerHTML = `
        <section>
            <h2 class="section-title">📚 Document Categories</h2>
            <div id="categoryBar"></div>
            <div style="text-align: center;">
                <input id="searchInput" class="search-input" type="text" placeholder="🔍 Search your documents..." aria-label="Search documents">
            </div>
        </section>
        <section style="margin-top: 48px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h3 style="margin: 0; color: var(--text-secondary); font-size: 1.3rem; font-weight: 600;">
                    📋 Your Documents (${filteredFiles.length})
                </h3>
                <div style="color: var(--text-muted); font-size: 1rem; font-style: italic; font-weight: 500;">
                    ${filteredFiles.length === 0 ? 'No documents to display' : `Showing ${filteredFiles.length} document${filteredFiles.length !== 1 ? 's' : ''}`}
                </div>
            </div>
            <div id="cardGrid"></div>
        </section>
    `;
    $('#categoryBar').replaceWith(renderCategories());
    $('#cardGrid').replaceWith(renderCards());
    bindEvents();
}

function bindEvents() {
    // Category filter
    $all('.cat-btn').forEach(btn => {
        btn.onclick = () => {
            selectedCategory = btn.dataset.cat;
            filterFiles();
            renderUI();
        };
    });
    // Search
    $('#searchInput').oninput = function() {
        searchTerm = this.value.trim().toLowerCase();
        filterFiles();
        renderUI();
        $('#searchInput').value = this.value;
    };
    // View
    $all('.view-btn').forEach(btn => {
        btn.onclick = () => openModal(filteredFiles[btn.dataset.idx]);
    });
    // Delete logic removed
}

function filterFiles() {
    filteredFiles = files.filter(f => {
        const matchCat = selectedCategory === "All" || f.categories.includes(selectedCategory);
        const matchSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm);
        return matchCat && matchSearch;
    });
}

function handleFiles(fileList) {
    // Upload logic removed
}

function openModal(file) {
    const modal = $('#modal');
    const viewer = $('#viewer');
    viewer.innerHTML = '';
    if (file.type === 'pdf') {
        viewer.innerHTML = `<embed src="${file.url}" type="application/pdf" width="500" height="600" style="max-width:80vw;max-height:70vh;">`;
    } else if (file.type === 'image') {
        viewer.innerHTML = `<img src="${file.url}" alt="${file.name}" style="max-width:80vw;max-height:70vh;">`;
    }
    $('#downloadBtn').href = file.url;
    $('#downloadBtn').download = file.name;
    modal.style.display = 'flex';
}

$('#closeModal').onclick = function() {
    $('#modal').style.display = 'none';
    $('#viewer').innerHTML = '';
};

window.onclick = function(event) {
    if (event.target === $('#modal')) {
        $('#modal').style.display = 'none';
        $('#viewer').innerHTML = '';
    }
};

// Theme logic - Updated for data attribute approach
function setTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        $('#themeToggle .toggle-icon').textContent = "☀️";
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        $('#themeToggle .toggle-icon').textContent = "🌙";
        localStorage.setItem('theme', 'light');
    }
}

$('#themeToggle').onclick = function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
};

(function initTheme() {
    const saved = localStorage.getItem('theme');
    setTheme(saved === 'dark');
})();

// Initial render
filterFiles();
renderUI();
