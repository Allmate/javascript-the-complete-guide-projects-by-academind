'use strict';

const addMovieBtn = document.getElementById('add-movie-btn');
const searchMovieBtn = document.getElementById('search-btn');
const movieListEl = document.getElementById('movie-list');

const movies = [
    {id: 1, info: {title: 'Avengers: The Infinity War', releaseDate: 2022}},
    {id: 2, info: {title: 'Avengers: Secret War', releaseDate: 2022}},
    {id: 3, info: {title: 'The Dark Knight', releaseDate: 2022}},
];

const updateUi = function () {
    if(movies.length > 0) {
        movieListEl.classList.add('visible');
    }
    else{
        movieListEl.classList.remove('visible');
    }
};

const renderMovie = function (movie) {
    const movieEl = document.createElement('li');

    for(const key in movie.info) {
        if(key !== 'title'){
            movieEl.textContent = `${movie.info.title} - ${key}:${movie.info[key]}`;
        }
    }

    movieListEl.appendChild(movieEl);

    updateUi();
};

const renderSearchMovies = function (searchTerm = '') {
    const searchMovies = !searchTerm ? movies : movies.filter(movie => movie.info.title.toLowerCase().includes(searchTerm));

    movieListEl.innerHTML = '';

    searchMovies.forEach(movie => {
        renderMovie(movie);
    });
};

addMovieBtn.addEventListener('click', function () {
    const title = document.getElementById('title').value.trim();
    const extraName = document.getElementById('extra-name').value.trim();
    const extraValue = document.getElementById('extra-value').value.trim();

    if([title, extraName, extraValue].includes('')) return;

    const newMovie = {
        id: movies.length + 1,
        info: {
            title,
            [extraName]: extraValue
        }
    };

    movies.push(newMovie);

    renderMovie(newMovie);
});

searchMovieBtn.addEventListener('click', function () {
    const searchTerm = document.getElementById('filter-title').value.trim().toLowerCase();

    renderSearchMovies(searchTerm);
});