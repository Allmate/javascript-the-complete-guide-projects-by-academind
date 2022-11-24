// concerning with addMovie modal
const addMovieModal = document.getElementById('add-modal');
const startAddMovieBtn = document.querySelector('header button');
const confirmAddMovieModalBtn = addMovieModal.querySelector('.modal__actions').lastElementChild;
const cancelAddMovieModalBtn = addMovieModal.querySelector('.modal__actions').firstElementChild;
const userInputs = addMovieModal.querySelectorAll('.modal__content input');

// concerning with delMovie modal
const delMovieModal = document.getElementById('delete-modal');
const cancelDelMovieModalBtn = delMovieModal.querySelector('.modal__actions').firstElementChild;
const confirmDelMovieModalBtn = delMovieModal.querySelector('.modal__actions').lastElementChild;

const backdrop = document.getElementById('backdrop');
const movieListEl = document.getElementById('movie-list');

const movies = [];

const showAddMovieModal = function () {
    addMovieModal.classList.add('visible');
    toggleBackdrop();
};

const closeAddMovieModal = function () {
    addMovieModal.classList.remove('visible');
    toggleBackdrop();
};

const showConfirmDelMovieModal = function () {
    delMovieModal.classList.add('visible');
    toggleBackdrop();
};

const closeConfirmDelMovieModal = function () {
    delMovieModal.classList.remove('visible');
    toggleBackdrop();
};

const toggleBackdrop = function () {
    backdrop.classList.toggle('visible');
};

const clearUserInputs = function () {
    for (const userInput of userInputs) {
        userInput.value = '';
    }
};

const renderNewMovie = function (movie) {
    const {id, title, imageUrl, rating} = movie;

    const newMovieEl = document.createElement('li');
    newMovieEl.className = 'movie-element';
    newMovieEl.dataset.movieId = id;

    newMovieEl.innerHTML = `
        <div class="movie-element__image">
            <img src="${imageUrl}" alt="${title}">
        </div>        
        <div class="movie-element__info">
            <h2>${title}</h2>
            <p>${rating}/5 stars</p>
        </div>
    `;

    movieListEl.appendChild(newMovieEl);
};

const updateUI = function () {
    if (movies.length > 0)
        document.getElementById('entry-text').style.display = 'none';
    else
        document.getElementById('entry-text').style.display = 'block';
};

const deleteMovieHandler = (e) => {
    const movieEl = e.target.closest('.movie-element');

    movieEl.remove();

    const deletedMovieId = +movieEl.dataset.movieId;

    const deletedMovieIndex = movies.findIndex((movie) => movie.id === deletedMovieId);

    movies.splice(deletedMovieIndex, 1);

    closeConfirmDelMovieModal();

    updateUI();
};

// concerning with addMovie modal
startAddMovieBtn.addEventListener('click', showAddMovieModal);
cancelAddMovieModalBtn.addEventListener('click', closeAddMovieModal);

backdrop.addEventListener('click', function () {
    if (addMovieModal.classList.contains('visible')) {
        closeAddMovieModal();
    }

    if (delMovieModal.classList.contains('visible')) {
        closeConfirmDelMovieModal();
    }

    if (backdrop.classList.contains('visible')) {
        toggleBackdrop();
    }
});

confirmAddMovieModalBtn.addEventListener('click', function () {
    /*
        if userInputs in form;
        e.preventDefault();
        form.title.value.trim();
     */
    const title = userInputs[0].value.trim();
    const imageUrl = userInputs[1].value.trim();
    const rating = +userInputs[2].value.trim();

    if ([title, imageUrl, rating].includes('') || (rating < 1 || rating > 5)) {
        alert('Please enter valid values(rating between 1 and 5)');
        return;
    }

    const movie = {
        id: movies.length === 0 ? 1 : movies.length,
        title,
        imageUrl,
        rating
    };

    movies.push(movie);

    closeAddMovieModal();

    clearUserInputs();

    updateUI();

    renderNewMovie(movie);
});

// concerning with delMovie modal
cancelDelMovieModalBtn.addEventListener('click', closeConfirmDelMovieModal);

// for removing movieEl
movieListEl.addEventListener('click', function (e) {
    showConfirmDelMovieModal();
    // the listener will automatically remove when invoked
    confirmDelMovieModalBtn.addEventListener('click', () => deleteMovieHandler(e), {once: true});
});