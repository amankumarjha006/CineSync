import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Results from './pages/Results'
import Genres from './pages/Genres'
import GenreMovies from './pages/GenreMovies'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/results' element={<Results />} />
          <Route path='/genres' element={<Genres />} />
          <Route path='/genres/:genre' element={<GenreMovies />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App