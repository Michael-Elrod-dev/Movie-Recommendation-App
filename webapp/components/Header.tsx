// components/Header.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import Link from 'next/link'
import type { ProcessedMovie } from '@/components/MovieRow'
import movieData from '@/processed_movies.json'

export default function Header({ onMovieSelect }: { 
  onMovieSelect?: (movie: ProcessedMovie) => void 
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<ProcessedMovie[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const movies: ProcessedMovie[] = movieData as ProcessedMovie[]

  useEffect(() => {
    // Handle clicking outside of search area to close it
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    
    if (term.length > 0) {
      const filtered = movies
        .filter(movie => 
          movie.title.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 results
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }

  const handleMovieClick = (movie: ProcessedMovie) => {
    if (onMovieSelect) {
      onMovieSelect(movie)
    }
    setIsSearchOpen(false)
    setSearchTerm('')
    setSearchResults([])
  }

  return (
    <header className="fixed w-full z-50 bg-black/95">
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-red-600">MOVIEFLIX</h1>
          <div className="flex space-x-6">
            <Link href="/browse" className="hover:text-gray-300">Browse</Link>
            <Link href="/mylist" className="hover:text-gray-300">My List</Link>
          </div>
        </div>
        
        <div className="flex items-center relative">
          <div className="relative">
            <input
              ref={inputRef}
              className={`
                bg-white text-black rounded-full py-2 px-4 pr-12 outline-none
                transition-all duration-300 ease-in-out
                ${isSearchOpen ? 'w-60 opacity-100' : 'w-0 opacity-0'}
              `}
              placeholder="Search titles..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
            />
            <button 
              className={`p-2 hover:bg-gray-800 rounded-full z-10 transition-colors absolute right-0 top-1/2 transform -translate-y-1/2
                ${isSearchOpen ? 'bg-gray-800' : ''}`}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FiSearch className="w-6 h-6" />
            </button>

            {/* Search Results Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute top-full left-0 w-full mt-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden"
              >
                {searchResults.map((movie) => (
                  <div
                    key={movie.movieId}
                    className="p-2 hover:bg-gray-800 cursor-pointer flex items-center space-x-4"
                    onClick={() => handleMovieClick(movie)}
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-12 bg-gray-800 rounded flex-shrink-0" />
                    
                    {/* Movie Info */}
                    <div className="flex-grow">
                      <div className="text-sm font-medium">{movie.title}</div>
                      <div className="text-xs text-gray-400">
                        {movie.genre1}{movie.genre2 && `, ${movie.genre2}`}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {movie.averageRating > 0 && (
                      <div className="text-sm font-semibold">
                        {movie.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}