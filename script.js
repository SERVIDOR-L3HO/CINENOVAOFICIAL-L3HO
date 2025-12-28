// Official API Base URL
const API_BASE = "https://cinenovaoficial.vercel.app/api";

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
    
    movieGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

    try {
        const endpoint = type === 'tv' ? '/tv/channels' : `/${type}`;
        const response = await fetch(`${API_BASE}${endpoint}`);
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            allMovies = data;
        } else if (data[type] && Array.isArray(data[type])) {
            allMovies = data[type];
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
        movieGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.2rem;">No se encontró contenido disponible.</p>';
        return;
    }

    itemsToDisplay.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 50).toString());
        
        const title = item.title || item.name || "Sin título";
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : (item.image || item.poster || item.logo || 'https://via.placeholder.com/500x750?text=CineNova');
        const rating = item.vote_average || item.rating || (currentType === 'tv' ? 'LIVE' : 'N/A');
        
        card.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <div class="rating">
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
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : (item.image || item.poster || item.logo);
    const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : (item.backdrop || poster);
    const rating = item.vote_average || item.rating || 'N/A';
    const year = item.release_date ? item.release_date.split('-')[0] : (item.year || '');
    const overview = item.overview || "Disfruta de este contenido en CineNova Oficial.";
    
    // Support for IMDb ID as mentioned in the screenshot for the VIP player
    const imdbId = item.imdb_id || (item.external_ids ? item.external_ids.imdb_id : null);
    
    let playAction = `alert('Reproduciendo: ${title}')`;
    if (currentType === 'tv') {
        playAction = `alert('Conectando a señal en vivo: ${title}')`;
    } else if (imdbId) {
        playAction = `playWithIMDB('${imdbId}')`;
    }

    modalBody.innerHTML = `
        <div class="modal-hero" style="background-image: url('${backdrop}')"></div>
        <div class="modal-details">
            <img src="${poster}" alt="${title}">
            <div class="modal-text">
                <h2>${title} ${year ? `(${year})` : ''}</h2>
                <div class="rating" style="margin-bottom: 15px;">
                    <i class="fas fa-star"></i> ${rating} / 10
                </div>
                <p>${overview}</p>
                <button class="btn-primary" onclick="${playAction}">
                    <i class="fas fa-play"></i> ${currentType === 'tv' ? 'Ver Señal' : 'Ver Ahora'}
                </button>
            </div>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function playWithIMDB(id) {
    console.log("Mapeo Inteligente de ID:", id);
    // Here we would integrate the VIP player mentioned in the screenshot
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

searchInput.addEventListener('input', async (e) => {
    const term = e.target.value.trim().toLowerCase();
    if (term.length > 2) {
        try {
            const endpoint = currentType === 'tv' ? `/tv/channels` : `/${currentType}/search?query=${encodeURIComponent(term)}`;
            const response = await fetch(`${API_BASE}${endpoint}`);
            const data = await response.json();
            const results = Array.isArray(data) ? data : (data.results || []);
            if (results.length > 0) {
                displayMovies(results);
                return;
            }
        } catch (error) {
            console.warn("Search API failed");
        }
    }
    
    const filtered = allMovies.filter(m => 
        (m.title || m.name || "").toLowerCase().includes(term) || 
        (m.overview || "").toLowerCase().includes(term)
    );
    displayMovies(filtered);
});

function getFallbackData(type) {
    if (type === 'tv') {
        return [
            { name: "HBO Latino", logo: "https://via.placeholder.com/500x750?text=HBO+Latino", rating: "LIVE" },
            { name: "ESPN 1", logo: "https://via.placeholder.com/500x750?text=ESPN+1", rating: "LIVE" },
            { name: "Fox Sports", logo: "https://via.placeholder.com/500x750?text=Fox+Sports", rating: "LIVE" }
        ];
    }
    // Fallback static movies
    return [
        { title: "Dune: Part Two", image: "https://image.tmdb.org/t/p/w500/1pdfbe1vOZ4Lfbw7G9psZfs9Sqz.jpg", rating: 8.4, year: 2024 },
        { title: "Godzilla x Kong", image: "https://image.tmdb.org/t/p/w500/v499v88pXpU0I7r4R8mQv8W0A6C.jpg", rating: 7.2, year: 2024 }
    ];
}

// Initial Load
fetchContent('movies');