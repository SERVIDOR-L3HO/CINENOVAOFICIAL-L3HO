const API_BASE = "https://0b61924f-2a5d-45a9-ae48-914e2755deee-00-24nsj2my4z7eq.janeway.replit.dev/api";
let currentData = [];
let currentCategory = 'movies';

// DOM Elements
const movieGrid = document.getElementById('movieGrid');
const modal = document.getElementById('modal');
const playerWrapper = document.getElementById('playerWrapper');
const detailsPane = document.getElementById('detailsPane');
const searchInput = document.getElementById('searchInput');
const hero = document.getElementById('hero');
const heroTitle = document.getElementById('heroTitle');
const heroOverview = document.getElementById('heroOverview');
const heroPlayBtn = document.getElementById('heroPlayBtn');
const listTitle = document.getElementById('listTitle');

// Initial Load
async function init() {
    await fetchCategory('movies');
    setupHeader();
}

async function fetchCategory(category) {
    currentCategory = category;
    const endpoint = category === 'tv' ? '/tv/channels' : `/${category}`;
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        const data = await response.json();
        currentData = Array.isArray(data) ? data : (data.results || data.movies || data.series || []);
        
        if (currentData.length > 0) {
            updateHero(currentData[0]);
            renderGrid(currentData);
        }
        
        const titles = { 'movies': 'Películas Populares', 'series': 'Series de Estreno', 'tv': 'Canales en Vivo' };
        listTitle.textContent = titles[category] || 'Explorar';
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderGrid(items) {
    movieGrid.innerHTML = '';
    items.forEach(item => {
        const title = item.title || item.name;
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : (item.image || item.poster || item.logo || 'https://via.placeholder.com/500x750?text=CineNova');
        const rating = item.vote_average || item.rating || (currentCategory === 'tv' ? 'LIVE' : 'N/A');
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="card-info">
                <h4>${title}</h4>
                <div class="rating">${rating} Coincidencia</div>
            </div>
        `;
        card.onclick = () => openPlayer(item);
        movieGrid.appendChild(card);
    });
}

function updateHero(item) {
    const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : (item.backdrop || item.image || item.poster);
    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 30%, transparent), url('${backdrop}')`;
    heroTitle.textContent = item.title || item.name;
    heroOverview.textContent = item.overview ? (item.overview.substring(0, 160) + '...') : 'Disfruta de la mejor calidad solo en CineNova Premium.';
    heroPlayBtn.onclick = () => openPlayer(item);
}

function openPlayer(item) {
    const id = item.imdb_id || item.id;
    const type = currentCategory === 'series' ? 'tv' : 'movie';
    const title = item.title || item.name;
    
    // Player source logic - Using VidSrc as it's reliable for these projects
    let playerUrl = '';
    if (currentCategory === 'tv') {
        playerUrl = item.url || '#';
        window.open(playerUrl, '_blank');
        return;
    } else {
        // Embed player integration
        playerUrl = `https://vidsrc.to/embed/${type}/${id}`;
    }

    playerWrapper.innerHTML = `<iframe src="${playerUrl}" allowfullscreen></iframe>`;
    detailsPane.innerHTML = `
        <h2>${title}</h2>
        <div class="meta">
            <span>${item.release_date || item.first_air_date || ''}</span>
            <span style="border: 1px solid #666; padding: 0 5px;">HD</span>
            <span style="color: #46d369;">${item.vote_average || '8.5'} Rating</span>
        </div>
        <p>${item.overview || 'Sin descripción disponible para este título.'}</p>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    playerWrapper.innerHTML = '';
    document.body.style.overflow = 'auto';
}

function switchCategory(category, el) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
    fetchCategory(category);
}

function setupHeader() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });
}

// Search
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = currentData.filter(item => 
        (item.title || item.name || '').toLowerCase().includes(term)
    );
    renderGrid(filtered);
});

init();