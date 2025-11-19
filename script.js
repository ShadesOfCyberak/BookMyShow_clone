// Sample movie data (in a real app, this would come from an API)
const movies = [
    {
        id: 1,
        title: "The Shawshank Redemption",
        year: 1994,
        genre: "drama",
        rating: 9.3,
        poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        description: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
        director: "Frank Darabont",
        cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
    },
    {
        id: 2,
        title: "The Godfather",
        year: 1972,
        genre: "crime",
        rating: 9.2,
        poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        director: "Francis Ford Coppola",
        cast: ["Marlon Brando", "Al Pacino", "James Caan"]
    },
    {
        id: 3,
        title: "Inception",
        year: 2010,
        genre: "sci-fi",
        rating: 8.8,
        poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]
    },
    {
        id: 4,
        title: "Pulp Fiction",
        year: 1994,
        genre: "crime",
        rating: 8.9,
        poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        director: "Quentin Tarantino",
        cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"]
    },
    {
        id: 5,
        title: "The Dark Knight",
        year: 2008,
        genre: "action",
        rating: 9.0,
        poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        director: "Christopher Nolan",
        cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
    },
    {
        id: 6,
        title: "Parasite",
        year: 2019,
        genre: "drama",
        rating: 8.6,
        poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
        description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        director: "Bong Joon Ho",
        cast: ["Song Kang-Ho", "Lee Sun-Kyun", "Cho Yeo-Jeong"]
    },
    {
        id: 7,
        title: "Interstellar",
        year: 2014,
        genre: "sci-fi",
        rating: 8.6,
        poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
    },
    {
        id: 8,
        title: "The Matrix",
        year: 1999,
        genre: "sci-fi",
        rating: 8.7,
        poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        director: "Lana Wachowski, Lilly Wachowski",
        cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
    }
];

// DOM elements
const movieGrid = document.getElementById('movieGrid');
const popularGrid = document.getElementById('popularGrid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');
const modal = document.getElementById('movieModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');
const navLinks = document.querySelector('.nav-links');

// Add hamburger menu to HTML programmatically for mobile
const navContainer = document.querySelector('.nav-container');
const mobileMenuBtn = document.createElement('div');
mobileMenuBtn.className = 'mobile-menu-btn';
mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
navContainer.insertBefore(mobileMenuBtn, document.querySelector('.nav-right'));

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// Event listeners
searchButton.addEventListener('click', filterMovies);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterMovies();
    }
});
genreFilter.addEventListener('change', filterMovies);
yearFilter.addEventListener('change', filterMovies);
ratingFilter.addEventListener('change', filterMovies);
closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// CTA button scroll functionality
document.getElementById('exploreBtn').addEventListener('click', () => {
    document.querySelector('header').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Initialize the app
displayMovies(movies);
displayPopularMovies();

// Functions
function displayMovies(moviesToDisplay) {
    movieGrid.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No movies found matching your criteria.';
        noResults.style.gridColumn = '1 / -1';
        noResults.style.textAlign = 'center';
        noResults.style.padding = '2rem';
        movieGrid.appendChild(noResults);
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.id = movie.id;

        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    ${movie.rating.toFixed(1)}
                </div>
            </div>
        `;

        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        movieGrid.appendChild(movieCard);
    });
}

function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const genreValue = genreFilter.value.toLowerCase();
    const yearValue = yearFilter.value;
    const ratingValue = parseFloat(ratingFilter.value) || 0;

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm) || 
                             movie.description.toLowerCase().includes(searchTerm);
        
        const matchesGenre = genreValue === '' || movie.genre === genreValue;
        
        let matchesYear = yearValue === '';
        if (yearValue === 'older') {
            matchesYear = movie.year < 2020;
        } else if (yearValue !== '') {
            matchesYear = movie.year === parseInt(yearValue);
        }
        
        const matchesRating = movie.rating >= ratingValue;
        
        return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });
    
    displayMovies(filteredMovies);
}

function showMovieDetails(movieId) {
    const movie = movies.find(m => m.id === movieId);
    
    if (!movie) return;
    
    modalContent.innerHTML = `
        <div class="movie-detail">
            <div class="detail-poster">
                <img src="${movie.poster}" alt="${movie.title}">
            </div>
            <div class="detail-info">
                <h2 class="detail-title">${movie.title}</h2>
                <div class="detail-meta">
                    <span>${movie.year}</span>
                    <span>|</span>
                    <span>${movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)}</span>
                    <span>|</span>
                    <span><i class="fas fa-star" style="color: gold;"></i> ${movie.rating.toFixed(1)}</span>
                </div>
                <p class="detail-description">${movie.description}</p>
                <p><strong>Director:</strong> ${movie.director}</p>
                <div class="detail-cast">
                    <h3>Cast</h3>
                    <div class="cast-list">
                        ${movie.cast.map(actor => `
                            <div class="cast-item">
                                <div class="cast-img" style="background-color: #ddd; display: flex; justify-content: center; align-items: center;">
                                    <i class="fas fa-user" style="font-size: 2rem; color: #999;"></i>
                                </div>
                                <p class="cast-name">${actor}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Function to get random movies for recommendations
function getRecommendations(movie, count = 3) {
    // In a real app, this would use an algorithm based on genre, ratings, etc.
    return movies
        .filter(m => m.id !== movie.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
}

// Function to display popular movies
function displayPopularMovies() {
    // In a real app, this would be fetched from an API with popularity ranking
    const popularMovies = [...movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    
    popularGrid.innerHTML = '';
    
    popularMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.id = movie.id;
        
        movieCard.innerHTML = `
            <div class="popular-badge"><i class="fas fa-fire"></i> Popular</div>
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    ${movie.rating.toFixed(1)}
                </div>
            </div>
        `;
        
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));
        popularGrid.appendChild(movieCard);
    });
}