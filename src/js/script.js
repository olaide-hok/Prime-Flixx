import '@fortawesome/fontawesome-free/js/all'
import Swiper from 'swiper'
// import Swiper styles
import 'swiper/css'
import '../css/style.css'
import '../css/spinner.css'
import NoImage from '../images/no-image.jpg'

const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0,
    },
    movies: {
        page: 1,
        totalPages: 1,
        totalResults: 0,
    },
    api: {
        apiKey: process.env.API_KEY,
        apiUrl: process.env.API_URL,
    },
}

// Displays 20 most popular movies to the home page.
async function displayPopularMovies() {
    const {results, total_pages, page, total_results} = await fetchAPIData(
        'movie/popular',
        'movies'
    )
    global.movies.page = page
    global.movies.totalPages = total_pages
    global.movies.totalResults = total_results

    displayMovies(results)
}

function displayMovies(results) {
    // Clear previous movies if it exists in the DOM.
    document.querySelector('#popular-movies').innerHTML = ''

    // Clear previous pagination if it exists in the DOM.
    document.querySelector('#pagination').innerHTML = ''

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
            src="${NoImage}"
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

    displayMoviesPagination()
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
                src="${NoImage}"
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

    // Overlay for background Image
    displayBackgroundImage('movie', movie.backdrop_path)

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
            src="${NoImage}"
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

// Display Show Details
async function displayShowDetails() {
    const showid = window.location.search.split('=')[1]

    const show = await fetchAPIData(`tv/${showid}`)

    // Overlay for background Image
    displayBackgroundImage('tv', show.backdrop_path)

    const div = document.createElement('div')

    div.innerHTML = `
    <div class="details-top">
    <div>
        ${
            show.poster_path
                ? `<img
        src="http://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
    />`
                : `<img
            src="${NoImage}"
            class="card-img-top"
            alt="${show.name}"
        />`
        }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
      <p>${show.overview} </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${
          show.homepage
      }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Number of episodes:</span> ${
          show.number_of_episodes
      } </li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${
          show.last_episode_to_air.name
      }</li>
      <li><span class="text-secondary">Status:</span> ${show.status} </li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies
        .map((company) => `<span>${company.name}</span>`)
        .join(', ')}</div>
  </div>
    `

    document.querySelector('#show-details').appendChild(div)
}

// Display the Backdrop on Details Pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div')
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
    overlayDiv.style.backgroundSize = 'cover'
    overlayDiv.style.backgroundPosition = 'center'
    overlayDiv.style.backgroundRepeat = 'no-repeat'
    overlayDiv.style.height = '100vh'
    overlayDiv.style.width = '100vw'
    overlayDiv.style.position = 'absolute'
    overlayDiv.style.top = '0'
    overlayDiv.style.left = '0'
    overlayDiv.style.zIndex = '-1'
    overlayDiv.style.opacity = '0.1'

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv)
    } else {
        document.querySelector('#show-details').appendChild(overlayDiv)
    }
}

// Search Movies/Shows
async function search() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    global.search.type = urlParams.get('type')
    global.search.term = urlParams.get('search-term')

    if (global.search.term !== '' && global.search.term !== null) {
        const {results, total_pages, page, total_results} =
            await searchAPIData()

        global.search.page = page
        global.search.totalPages = total_pages
        global.search.totalResults = total_results

        if (results.length === 0) {
            showAlert('No search results found')
            return
        }
        displaySearchResults(results)

        document.querySelector('#search-term').value = ''
    } else {
        showAlert('Please enter a search term')
    }
}

// Search results for movies/tv-shows
function displaySearchResults(results) {
    // Clear previous search results if it exists
    document.querySelector('#search-results').innerHTML = ''

    // Clear previous search results heading
    document.querySelector('#search-results-heading').innerHTML = ''

    // Clear previous pagination
    document.querySelector('#pagination').innerHTML = ''

    results.forEach((result) => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `        
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${
            result.poster_path
                ? `<img
        src="http://image.tmdb.org/t/p/w500/${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === 'movie' ? result.title : result.name}"
      />`
                : `<img
            src="${NoImage}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
          />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${
            global.search.type === 'movie' ? result.title : result.name
        }</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${
              global.search.type === 'movie'
                  ? result.release_date
                  : result.first_air_date
          }</small>
        </p>
      </div>        
    `
        document.querySelector('#search-results-heading').innerHTML = `
          <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term} </h2>
      `

        document.querySelector('#search-results').appendChild(div)
    })

    displayPagination()
}

// Create and display movies page pagination
function displayMoviesPagination() {
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = ` 
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.movies.page} of ${global.movies.totalPages} </div>
`
    document.querySelector('#pagination').appendChild(div)

    // Disable prev button if on first page
    if (global.movies.page === 1) {
        document.querySelector('#prev').disabled = true
    }

    // Disable next button if on last page
    if (global.movies.page === global.movies.totalPages) {
        document.querySelector('#next').disabled = true
    }

    // Next page
    document.querySelector('#next').addEventListener('click', async () => {
        global.movies.page++
        const {results} = await fetchAPIData('movie/popular', 'movies')
        displayMovies(results)
    })

    // Prev page
    document.querySelector('#prev').addEventListener('click', async () => {
        global.movies.page--
        const {results} = await fetchAPIData('movie/popular', 'movies')
        displayMovies(results)
    })
}

// Create and display search page pagination
function displayPagination() {
    const div = document.createElement('div')
    div.classList.add('pagination')
    div.innerHTML = ` 
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages} </div>
  `
    document.querySelector('#pagination').appendChild(div)

    // Disable prev button if on first page
    if (global.search.page === 1) {
        document.querySelector('#prev').disabled = true
    }

    // Disable next button if on last page
    if (global.search.page === global.search.totalPages) {
        document.querySelector('#next').disabled = true
    }

    // Next page
    document.querySelector('#next').addEventListener('click', async () => {
        global.search.page++
        const {results, total_pages} = await searchAPIData()
        displaySearchResults(results)
    })

    // Prev page
    document.querySelector('#prev').addEventListener('click', async () => {
        global.search.page--
        const {results, total_pages} = await searchAPIData()
        displaySearchResults(results)
    })
}

// Display Slider Movies
async function displayMoviesSlider() {
    const {results} = await fetchAPIData('movie/now_playing')

    results.forEach((movie) => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide')
        div.innerHTML = `      
            <a href="movie-details.html?id=${movie.id}">
                <img
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                    1
                )} / 10
            </h4>
          `

        document.querySelector('.swiper-wrapper').appendChild(div)

        initSwiper()
    })
}

// Display Slider Shows
async function displayShowsSlider() {
    const {results} = await fetchAPIData('tv/airing_today')

    results.forEach((show) => {
        const div = document.createElement('div')
        div.classList.add('swiper-slide')
        div.innerHTML = `      
          <a href="tv-details.html?id=${show.id}">
              <img
                  src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                  alt="${show.name}" />
          </a>
          <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
                  1
              )} / 10
          </h4>
        `

        document.querySelector('.swiper-wrapper').appendChild(div)

        initSwiper()
    })
}

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            },
        },
    })
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint, page) {
    const API_KEY = global.api.apiKey
    const API_URL = global.api.apiUrl

    showSpinner()

    let response

    if (page === 'movies') {
        response = await fetch(
            `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&page=${global.movies.page}`
        )
    } else {
        response = await fetch(
            `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&`
        )
    }

    const data = await response.json()

    hideSpinner()

    return data
}

// Make search request to TMDB Seearch API
async function searchAPIData() {
    const API_KEY = global.api.apiKey
    const API_URL = global.api.apiUrl

    showSpinner()

    const response = await fetch(
        `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
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

// Show Alert
function showAlert(message, className = 'error') {
    const alertEl = document.createElement('div')
    alertEl.classList.add('alert', className)
    alertEl.appendChild(document.createTextNode(message))
    document.querySelector('#alert').appendChild(alertEl)

    setTimeout(() => alertEl.remove(), 3000)
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
            displayMoviesSlider()
            displayPopularMovies()
            break
        case '/shows.html':
            displayShowsSlider()
            displayPopularShows()
            break
        case '/movie-details.html':
            displayMovieDetails()
            break
        case '/tv-details.html':
            displayShowDetails()
            break
        case '/search.html':
            search()
            break
    }

    highlightActiveLink()
}

document.addEventListener('DOMContentLoaded', init)
