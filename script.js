// Demo MVP: Card-based document viewer with categories, search (no upload, no backend)
const filesData = [
    {
        name: "Annual Report 2023",
        type: "pdf",
        url: "assets/sample.pdf",
        date: "2023-12-15",
        size: "2.4 MB",
        categories: ["Reports"],
        thumb: "assets/sample-thumb.jpg"
    },
    {
        name: "Project Proposal",
        type: "pdf",
        url: "assets/sample.pdf",
        date: "2023-11-28",
        size: "1.2 MB",
        categories: ["Proposals"],
        thumb: "assets/sample-thumb.jpg"
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
        grid.innerHTML = `<div class="empty-message">No documents found.</div>`;
        return grid;
    }
    filteredFiles.forEach((file, idx) => {
        grid.innerHTML += `
        <div class="doc-card">
            <div class="thumb-wrap">
                <img src="${file.thumb || (file.type === 'pdf' ? 'assets/pdf-icon.png' : file.url)}" class="thumb" alt="">
                <span class="file-type">${file.type.toUpperCase()}</span>
            </div>
            <div class="doc-info">
                <div class="doc-title">${file.name}</div>
                <div class="doc-meta">
                    <span>${file.date}</span> • <span>${file.size}</span>
                </div>
                <div class="doc-tags">
                    ${file.categories.map(cat => `<span class="doc-tag">${cat}</span>`).join('')}
                </div>
                <div class="doc-actions">
                    <button class="view-btn" data-idx="${idx}">View</button>
                    <a class="download-btn" href="${file.url}" download="${file.name}">Download</a>
                </div>
            </div>
        </div>
        `;
    });
    return grid;
}

function renderUI() {
    const container = $('.container');
    container.innerHTML = `
        <h1 style="text-align:left;font-size:2rem;margin-bottom:0.5em;"><span style="color:#2563eb;font-weight:700;">DocViewer</span></h1>
        <h2 style="margin-top:2em;">Categories</h2>
        <div id="categoryBar"></div>
        <div style="margin:18px 0 24px 0;">
            <input id="searchInput" class="search-input" type="text" placeholder="Search documents..." style="width:100%;max-width:350px;padding:10px 14px;border-radius:6px;border:1px solid #ddd;font-size:1rem;">
        </div>
        <div id="cardGrid"></div>
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

// Theme logic (unchanged)
function setTheme(night) {
    if (night) {
        document.body.classList.add('night');
        $('#themeToggle').textContent = "☀️";
        localStorage.setItem('theme', 'night');
    } else {
        document.body.classList.remove('night');
        $('#themeToggle').textContent = "🌙";
        localStorage.setItem('theme', 'day');
    }
}
$('#themeToggle').onclick = function() {
    setTheme(!document.body.classList.contains('night'));
};
(function initTheme() {
    const saved = localStorage.getItem('theme');
    setTheme(saved === 'night');
})();

// Initial render
filterFiles();
renderUI();
