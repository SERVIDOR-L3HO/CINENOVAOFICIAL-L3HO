// Definitive API Base URL
const API_BASE = "https://0b61924f-2a5d-45a9-ae48-914e2755deee-00-24nsj2my4z7eq.janeway.replit.dev/api";

let currentData = [];
let currentType = 'movies';

const movieGrid = document.getElementById('movieGrid');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');
const searchInput = document.getElementById('movieSearch');
const sectionTitle = document.querySelector('.section-title');

// Comprehensive Fetch Function
async function loadContent(type = 'movies') {
    currentType = type;
    
    // Update Title
    const titles = {
        'movies': 'Películas Populares',
        'series': 'Series y Estrenos',
        'tv': 'Televisión en Vivo'
    };
    if (sectionTitle) sectionTitle.textContent = titles[type];
    
    // Show Loading
    movieGrid.innerHTML = `
        <div class="loader-container">
            <div class="spinner"></div>
            <p>Sincronizando con CineNova...</p>
        </div>
    `;

    try {
        const endpoint = type === 'tv' ? '/tv/channels' : `/${type}`;
        const response = await fetch(`${API_BASE}${endpoint}`);
        
        if (!response.ok) throw new Error('CORS or Network Error');
        
        const data = await response.json();
        
        // Parse data based on common API structures
        if (Array.isArray(data)) {
            currentData = data;
        } else if (data.movies || data.series || data.results) {
            currentData = data.movies || data.series || data.results;
        } else {
            currentData = getFallback(type);
        }
    } catch (error) {
        console.error("API Error, loading fallback:", error);
        currentData = getFallback(type);
    }
    
    renderGrid(currentData);
}

function renderGrid(items) {
    movieGrid.innerHTML = '';
    
    if (!items || items.length === 0) {
        movieGrid.innerHTML = '<div class="empty-state">No se encontró contenido. Intenta otra categoría.</div>';
        return;
    }

    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index % 10 * 50).toString());
        
        const title = item.title || item.name || "CineNova";
        const poster = getPosterUrl(item);
        const rating = item.vote_average || item.rating || (currentType === 'tv' ? 'LIVE' : 'N/A');
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="image-wrapper">
                    <img src="${poster}" alt="${title}" loading="lazy">
                    <div class="overlay">
                        <div class="play-btn"><i class="fas fa-play"></i></div>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${title}</h3>
                    <div class="meta-info">
                        <span class="rating-tag"><i class="fas fa-star"></i> ${rating}</span>
                        <span class="type-tag">${currentType === 'tv' ? 'TV' : (currentType === 'movies' ? 'Cine' : 'Serie')}</span>
                    </div>
                </div>
            </div>
        `;
        
        card.onclick = () => showDetails(item);
        movieGrid.appendChild(card);
    });
}

function getPosterUrl(item) {
    if (item.poster_path) {
        return item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    }
    return item.image || item.poster || item.logo || 'https://via.placeholder.com/500x750?text=CineNova';
}

function showDetails(item) {
    const title = item.title || item.name;
    const poster = getPosterUrl(item);
    const backdrop = item.backdrop_path ? (item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/original${item.backdrop_path}`) : poster;
    const desc = item.overview || "Disfruta de la mejor calidad solo en CineNova Oficial.";
    const imdbId = item.imdb_id || (item.external_ids?.imdb_id);

    let action = `alert('Iniciando stream de: ${title}')`;
    if (imdbId) {
        action = `window.open('https://vidsrc.to/embed/movie/${imdbId}', '_blank')`;
    }

    modalBody.innerHTML = `
        <div class="modal-header-img" style="background-image: linear-gradient(to top, #111, transparent), url('${backdrop}')"></div>
        <div class="modal-info-grid">
            <div class="modal-poster">
                <img src="${poster}" alt="${title}">
            </div>
            <div class="modal-desc">
                <h1>${title}</h1>
                <div class="modal-tags">
                    <span class="tag-gold"><i class="fas fa-star"></i> ${item.vote_average || '8.5'}</span>
                    <span class="tag-white">HD / 4K</span>
                    <span class="tag-red">Premium</span>
                </div>
                <p>${desc}</p>
                <div class="modal-actions">
                    <button class="play-now" onclick="${action}"><i class="fas fa-play"></i> Ver Ahora</button>
                    <button class="add-list"><i class="fas fa-plus"></i> Mi Lista</button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

// Search Logic
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (term === '') {
        renderGrid(currentData);
        return;
    }
    
    const filtered = currentData.filter(item => 
        (item.title || item.name || "").toLowerCase().includes(term) ||
        (item.overview || "").toLowerCase().includes(term)
    );
    renderGrid(filtered);
});

// Navigation Logic
function switchTab(type) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
    loadContent(type);
}

closeModal.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

window.onclick = (e) => {
    if (e.target === modal) closeModal.onclick();
};

function getFallback(type) {
    const base = [
        { title: "Dune: Part Two", poster_path: "/1pdfbe1vOZ4Lfbw7G9psZfs9Sqz.jpg", vote_average: 8.4 },
        { title: "Godzilla x Kong", poster_path: "/v499v88pXpU0I7r4R8mQv8W0A6C.jpg", vote_average: 7.2 },
        { title: "The Dark Knight", poster_path: "/qJ2tW6WMUDp9asjZpDy9mS0S6Z4O6.jpg", vote_average: 9.0 },
        { title: "Interstellar", poster_path: "/gEU2YpU3MTRlsS0S6Z4O6.jpg", vote_average: 8.7 }
    ];
    if (type === 'tv') return [
        { name: "HBO Latino", logo: "https://via.placeholder.com/500x750?text=HBO+Latino", rating: "LIVE" },
        { name: "ESPN Deportes", logo: "https://via.placeholder.com/500x750?text=ESPN+Deportes", rating: "LIVE" }
    ];
    return base;
}

// Initialize
loadContent('movies');