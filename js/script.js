const global = {
    currentPage: window.location.pathname,
}

// Displays 20 most popular movies to the home page.
async function displayPopularMovies() {
    const {results} = await fetchAPIData('movie/popular')
    results.forEach((movie) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `        
          <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path
                    ? `<img
            src="http://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`
                    : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"
              />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>        
        `

        document.querySelector('#popular-movies').appendChild(div)
    })
}

// Displays 20 most popular tv shows to the TV shows page.
async function displayPopularShows() {
    const {results} = await fetchAPIData('tv/popular')
    results.forEach((show) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `        
          <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path
                    ? `<img
            src="http://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`
                    : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
              />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${show.first_air_date}</small>
            </p>
          </div>        
        `

        document.querySelector('#popular-shows').appendChild(div)
    })
}

// Display Movie Details
async function displayMovieDetails() {
    const movieid = window.location.search.split('=')[1]

    const movie = await fetchAPIData(`movie/${movieid}`)

    const div = document.createElement('div')

    div.innerHTML = `
    <div class="details-top">
    <div>
        ${
            movie.poster_path
                ? `<img
        src="http://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
    />`
                : `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
        />`
        }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>${movie.overview} </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${
          movie.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
          movie.budget
      )}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
          movie.revenue
      )}</li>
      <li><span class="text-secondary">Runtime:</span> ${
          movie.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status} </li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(', ')}</div>
  </div>
    `

    document.querySelector('#movie-details').appendChild(div)
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = '3419972f7a01d59a729595c7836782b3'
    const API_URL = 'https://api.themoviedb.org/3/'

    showSpinner()

    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    )

    const data = await response.json()

    hideSpinner()

    return data
}

// Show Spinner
function showSpinner() {
    document.querySelector('.spinner').classList.add('show')
}

// Hide Spinner
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show')
}

// Highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach((link) => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    })
}

// Add commas to numbers
function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Init App
function init() {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies()
            break
        case '/shows.html':
            displayPopularShows()
            break
        case '/movie-details.html':
            displayMovieDetails()
            break
        case '/tv-details.html':
            console.log('TV Details')
            break
        case '/search.html':
            console.log('Search')
            break
    }

    highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
