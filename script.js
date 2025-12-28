// New Official API Base URL provided by the user
const API_BASE = "https://0b61924f-2a5d-45a9-ae48-914e2755deee-00-24nsj2my4z7eq.janeway.replit.dev/api";

let allMovies = [];
let currentType = 'movies';

const movieGrid = document.getElementById('movieGrid');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');
const searchInput = document.getElementById('movieSearch');
const sectionTitle = document.querySelector('.section-title');

// Function to fetch content (movies, series, or tv)
async function fetchContent(type = 'movies') {
    currentType = type;
    const titles = {
        'movies': 'Películas Populares',
        'series': 'Series de Estreno',
        'tv': 'Canales de TV en Vivo'
    };
    
    if (sectionTitle) sectionTitle.textContent = titles[type];
    
    movieGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;"><i class="fas fa-spinner fa-spin fa-3x" style="color: #e50914;"></i></div>';

    try {
        const endpoint = type === 'tv' ? '/tv/channels' : `/${type}`;
        // Using a try-catch to handle fetch and fallback
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            allMovies = data;
        } else if (data[type] && Array.isArray(data[type])) {
            allMovies = data[type];
        } else if (data.movies && Array.isArray(data.movies)) {
            allMovies = data.movies;
        } else {
            allMovies = getFallbackData(type);
        }
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        allMovies = getFallbackData(type);
    }
    displayMovies(allMovies);
}

function displayMovies(itemsToDisplay) {
    movieGrid.innerHTML = '';
    if (!itemsToDisplay || itemsToDisplay.length === 0) {
        movieGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.5rem; margin-top: 50px;">No se encontró contenido disponible.</p>';
        return;
    }

    itemsToDisplay.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', (index * 50).toString());
        
        const title = item.title || item.name || "CineNova Contenido";
        // Flexible image path handling for different APIs
        let poster = 'https://via.placeholder.com/500x750?text=CineNova';
        if (item.poster_path) {
            poster = item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        } else if (item.image) {
            poster = item.image;
        } else if (item.poster) {
            poster = item.poster;
        } else if (item.logo) {
            poster = item.logo;
        }
        
        const rating = item.vote_average || item.rating || (currentType === 'tv' ? 'LIVE' : '8.0');
        
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${poster}" alt="${title}" loading="lazy">
                <div class="card-overlay">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="movie-info">
                <h3>${title}</h3>
                <div class="rating-badge">
                    <i class="fas fa-star"></i> ${rating}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(item));
        movieGrid.appendChild(card);
    });
}

function openModal(item) {
    const title = item.title || item.name;
    let poster = 'https://via.placeholder.com/500x750?text=CineNova';
    if (item.poster_path) {
        poster = item.poster_path.startsWith('http') ? item.poster_path : `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    } else if (item.image || item.poster || item.logo) {
        poster = item.image || item.poster || item.logo;
    }

    let backdrop = poster;
    if (item.backdrop_path) {
        backdrop = item.backdrop_path.startsWith('http') ? item.backdrop_path : `https://image.tmdb.org/t/p/original${item.backdrop_path}`;
    } else if (item.backdrop) {
        backdrop = item.backdrop;
    }

    const rating = item.vote_average || item.rating || '8.0';
    const year = item.release_date ? item.release_date.split('-')[0] : (item.year || '2024');
    const overview = item.overview || "Sumérgete en la mejor experiencia cinematográfica con CineNova. Contenido exclusivo en alta definición.";
    
    // Using the IMDb mapping mentioned in official docs
    const imdbId = item.imdb_id || (item.external_ids ? item.external_ids.imdb_id : null);
    
    let playAction = `alert('Reproduciendo: ${title}')`;
    if (currentType === 'tv') {
        playAction = `alert('Conectando a señal en vivo de ${title}...')`;
    } else if (imdbId) {
        playAction = `playWithIMDB('${imdbId}')`;
    }

    modalBody.innerHTML = `
        <div class="modal-hero" style="background-image: linear-gradient(to top, #181818, transparent), url('${backdrop}')"></div>
        <div class="modal-details">
            <div class="modal-poster-container">
                <img src="${poster}" alt="${title}">
            </div>
            <div class="modal-text">
                <h2>${title} <span class="year-span">(${year})</span></h2>
                <div class="modal-meta">
                    <span class="rating-pill"><i class="fas fa-star"></i> ${rating}</span>
                    <span class="quality-pill">4K Ultra HD</span>
                </div>
                <p class="overview-text">${overview}</p>
                <div class="modal-buttons">
                    <button class="btn-primary" onclick="${playAction}">
                        <i class="fas fa-play"></i> ${currentType === 'tv' ? 'Ver Señal' : 'Ver Ahora'}
                    </button>
                    <button class="btn-secondary">
                        <i class="fas fa-plus"></i> Mi Lista
                    </button>
                </div>
            </div>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function playWithIMDB(id) {
    console.log("Mapeo VIP activado para ID:", id);
    window.open(`https://vidsrc.to/embed/movie/${id}`, '_blank');
}

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

searchInput.addEventListener('input', debounce(async (e) => {
    const term = e.target.value.trim().toLowerCase();
    if (term.length > 2) {
        try {
            const endpoint = currentType === 'tv' ? `/tv/channels` : `/${currentType}/search?query=${encodeURIComponent(term)}`;
            const response = await fetch(`${API_BASE}${endpoint}`);
            if (response.ok) {
                const data = await response.json();
                const results = Array.isArray(data) ? data : (data.results || data.movies || []);
                if (results.length > 0) {
                    displayMovies(results);
                    return;
                }
            }
        } catch (error) {
            console.warn("Search API fail");
        }
    }
    
    const filtered = allMovies.filter(m => 
        (m.title || m.name || "").toLowerCase().includes(term) || 
        (m.overview || "").toLowerCase().includes(term)
    );
    displayMovies(filtered);
}, 300));

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function getFallbackData(type) {
    if (type === 'tv') {
        return [
            { name: "HBO Latino", logo: "https://via.placeholder.com/500x750?text=HBO+Latino", rating: "LIVE" },
            { name: "ESPN 1", logo: "https://via.placeholder.com/500x750?text=ESPN+1", rating: "LIVE" },
            { name: "TNT", logo: "https://via.placeholder.com/500x750?text=TNT", rating: "LIVE" }
        ];
    }
    return [
        { title: "Dune: Part Two", poster_path: "/1pdfbe1vOZ4Lfbw7G9psZfs9Sqz.jpg", vote_average: 8.4, release_date: "2024-03-01" },
        { title: "Godzilla x Kong", poster_path: "/v499v88pXpU0I7r4R8mQv8W0A6C.jpg", vote_average: 7.2, release_date: "2024-03-27" },
        { title: "Oppenheimer", poster_path: "/8Gxv0mYmUj9mS0S6Z4O6.jpg", vote_average: 8.9, release_date: "2023-07-21" }
    ];
}

// Initial Load
fetchContent('movies');