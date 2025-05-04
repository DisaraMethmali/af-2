import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import CountryCard from "../components/CountryCard"
import { getFavoriteCountries } from "../services/favoriteService"

const FavoritesPage = () => {
  const [favoriteCountries, setFavoriteCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const countries = await getFavoriteCountries()
        setFavoriteCountries(countries)
      } catch (err) {
        console.error("Error fetching favorites:", err)
        setError("Failed to load favorite countries. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchFavorites()
  }, [])
  
  if (loading) {
    return (
      <div className="container py-8 grid px-6 md:px-10">
        <h1 className="text-3xl font-bold mb-8 text-center">My Favorite Countries</h1>
        <div className="animate-pulse grid px-4 md:px-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-[340px]">
              <div className="h-40 bg-muted" />
              <div className="p-4">
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <main className="container py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Favorite Countries</h1>
      
      {error && (
        <div className="text-center py-6 px-4">
          <p className="text-xl text-destructive">{error}</p>
        </div>
      )}

      {!error && favoriteCountries.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-xl text-muted">You haven't added any countries to your favorites yet.</p>
          <Link to="/" className="btn btn-primary mt-4">
            Explore Countries
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 px-10 mx-auto" style={{ paddingLeft: "80px", paddingRight: "40px" }}>
          {favoriteCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </main>
  )
}

export default FavoritesPage