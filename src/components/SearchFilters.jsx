import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { FaSearch, FaTimes } from "react-icons/fa"

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"]
const languages = ["English", "Spanish", "French", "Arabic", "Chinese", "Russian", "Portuguese", "German"]

const SearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [region, setRegion] = useState(searchParams.get("region") || "")
  const [language, setLanguage] = useState(searchParams.get("language") || "")

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (region) params.set("region", region)
    if (language) params.set("language", language)

    setSearchParams(params)
  }, [search, region, language, setSearchParams])

  const clearFilters = () => {
    setSearch("")
    setRegion("")
    setLanguage("")
  }

  const hasFilters = search || region || language

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="select">
            <option value="">Filter by Region</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="select">
            <option value="">Filter by Language</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="btn btn-outline flex items-center gap-2">
              <FaTimes size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
