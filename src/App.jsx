import { useState } from 'react'
import './App.css'

// Vite exposes env vars prefixed with VITE_ on import.meta.env.
// This value gets baked into the build at build time.
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5/weather'

function App() {
  const [city, setCity] = useState('Lahore')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchWeather(e) {
    e.preventDefault()
    setError('')
    setWeather(null)

    if (!API_KEY) {
      setError(
        'No API key found. Add VITE_WEATHER_API_KEY to your .env file (see .env.example).'
      )
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      )
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Invalid API key' : `Request failed (${res.status})`)
      }
      const data = await res.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>CI/CD Demo: Weather Lookup</h1>
      <p className="subtitle">
        A minimal app built to practice env vars, linting, and GitHub Actions deploys.
      </p>

      <form onSubmit={fetchWeather} className="search-form">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && weather.main && (
        <div className="result">
          <h2>{weather.name}</h2>
          <p>{Math.round(weather.main.temp)}°C</p>
          <p>{weather.weather?.[0]?.description}</p>
        </div>
      )}

      <footer className="status">
        <span>API key loaded: {API_KEY ? 'yes' : 'no'}</span>
      </footer>
    </div>
  )
}

export default App
