import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_URL = 'https://api.themoviedb.org/3'

export const getRecommendations = async (title) => {
    const response = await axios.get(`${BASE_URL}/recommend/${title}`)
    return response.data
}
export const searchMovies = async (query) => {
    const search = await axios.get(`${BASE_URL}/search?query=${query}`)
    return search.data
}
export const getMovieDetails = async (title) => {
    try {
        const res = await axios.get(`${TMDB_URL}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`)
        return res.data?.results?.[0] || null
    } catch (error) {
        console.error(`Error fetching movie details for ${title}:`, error)
        return null
    }
}

export const getMoviePoster = async (title) => {
    try {
        const res = await axios.get(`${TMDB_URL}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`)
        const movie = res.data?.results?.[0]
        if (movie && movie.poster_path) {
            return `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }
        return null
    } catch (error) {
        console.error(`Error fetching poster for ${title}:`, error)
        return null
    }
}

export const getMovieCredits = async (title) => {
    try {
        const response = await axios.get(`${BASE_URL}/credits/${title}`)
        return response.data
    } catch (error) {
        console.error("Error fetching credits:", error)
        return { director: "Unknown", cast: [], genres: "[]" }
    }
}

export const getAllGenres = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/genres`)
        return response.data
    } catch (error) {
        console.error("Error fetching genres:", error)
        return { genres: [] }
    }
}

export const getMoviesByGenre = async (genre, count = "20") => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/${encodeURIComponent(genre)}?n=${count}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching movies for genre ${genre}:`, error)
        return { results: [] }
    }
}