// Movie data - using a fallback since the requested API is having issues
const movies = [
    {
        id: 1,
        title: "Dune: Part Two",
        image: "https://image.tmdb.org/t/p/w500/1pdfbe1vOZ4Lfbw7G9psZfs9Sqz.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/8YvL9YjA3y0O7zE7fHqO0S6Z4O6.jpg",
        rating: 8.4,
        overview: "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.",
        year: 2024
    },
    {
        id: 2,
        title: "Godzilla x Kong",
        image: "https://image.tmdb.org/t/p/w500/v499v88pXpU0I7r4R8mQv8W0A6C.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/qr99MCHh5499v88pXpU0I7r4R8m.jpg",
        rating: 7.2,
        overview: "Una aventura cinematográfica completamente nueva, que enfrentará al todopoderoso Kong y al temible Godzilla contra una colosal amenaza desconocida.",
        year: 2024
    },
    {
        id: 3,
        title: "Oppenheimer",
        image: "https://image.tmdb.org/t/p/w500/8Gxv0mYmUj9mS0S6Z4O6.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/8Gxv0mYmUj9mS0S6Z4O6.jpg",
        rating: 8.9,
        overview: "La historia del físico estadounidense J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica.",
        year: 2023
    },
    {
        id: 4,
        title: "Spider-Man: Across the Spider-Verse",
        image: "https://image.tmdb.org/t/p/w500/8Vt6m9ueYv8S0S6Z4O6.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/8Vt6m9ueYv8S0S6Z4O6.jpg",
        rating: 9.1,
        overview: "Miles Morales regresa para el siguiente capítulo de la saga ganadora del Oscar Spider-Verse.",
        year: 2023
    },
    {
        id: 5,
        title: "John Wick: Chapter 4",
        image: "https://image.tmdb.org/t/p/w500/h5v9v88pXpU0I7r4R8mQv8W0A6C.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/h5v9v88pXpU0I7r4R8mQv8W0A6C.jpg",
        rating: 8.2,
        overview: "John Wick descubre un camino para derrotar a la Mesa Alta.",
        year: 2023
    },
    {
        id: 6,
        title: "The Batman",
        image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36mS0S6Z4O6.jpg",
        backdrop: "https://image.tmdb.org/t/p/original/74xTEgt7R36mS0S6Z4O6.jpg",
        rating: 8.5,
        overview: "En su segundo año luchando contra el crimen, Batman explora la corrupción que existe en la ciudad de Gotham.",
        year: 2022
    }
];

const movieGrid = document.getElementById('movieGrid');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.querySelector('.close-modal');
const searchInput = document.getElementById('movieSearch');

function displayMovies(moviesToDisplay) {
    movieGrid.innerHTML = '';
    moviesToDisplay.forEach((movie, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        
        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <div class="rating">
                    <i class="fas fa-star"></i> ${movie.rating}
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openMovieModal(movie));
        movieGrid.appendChild(card);
    });
}

function openMovieModal(movie) {
    modalBody.innerHTML = `
        <div class="modal-hero" style="background-image: url('${movie.backdrop || movie.image}')"></div>
        <div class="modal-details">
            <img src="${movie.image}" alt="${movie.title}">
            <div class="modal-text">
                <h2>${movie.title} (${movie.year})</h2>
                <div class="rating" style="margin-bottom: 15px;">
                    <i class="fas fa-star"></i> ${movie.rating} / 10
                </div>
                <p>${movie.overview}</p>
                <button class="btn-primary" onclick="alert('Reproduciendo: ${movie.title}')">
                    <i class="fas fa-play"></i> Ver Ahora
                </button>
            </div>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
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

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = movies.filter(m => 
        m.title.toLowerCase().includes(term) || 
        m.overview.toLowerCase().includes(term)
    );
    displayMovies(filtered);
});

// Initialize
displayMovies(movies);