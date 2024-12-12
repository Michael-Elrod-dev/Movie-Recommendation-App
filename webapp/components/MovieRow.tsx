// components/MovieRow.tsx
'use client'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { useRef, useEffect, useState } from 'react'

export interface ProcessedMovie {
  movieId: number;
  title: string;
  genre1: string;
  genre2: string;
  averageRating: number;
  ratingCount: number;
}

const formatRatingCount = (count: number) => {
  return count >= 1000 ? '1k+' : count.toString();
}

export function MovieRow({ 
  title, 
  movies,
  onMovieClick,
}: { 
  title: string, 
  movies: ProcessedMovie[],
  onMovieClick?: (movie: ProcessedMovie) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 320 * 3
    const newScrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    })
  }
  
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScroll = () => {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      )
    }

    checkScroll()
    container.addEventListener('scroll', checkScroll)
    return () => container.removeEventListener('scroll', checkScroll)
  }, [])

  if (movies.length === 0) {
    return (
      <div className="space-y-2 px-4 my-8">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-gray-400 italic">
          {title === "My Ratings" 
            ? "No rated movies yet. Click on movies to rate them!"
            : "Rate some movies to see personalized recommendations"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2 px-4 my-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-40 ${
            canScrollLeft ? 'hidden group-hover:block' : 'hidden'
          } bg-black bg-opacity-50 hover:bg-opacity-70 px-2`}
        >
          <IoIosArrowBack className="w-6 h-6" />
        </button>
        <button 
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-40 ${
            canScrollRight ? 'hidden group-hover:block' : 'hidden'
          } bg-black bg-opacity-50 hover:bg-opacity-70 px-2`}
        >
          <IoIosArrowForward className="w-6 h-6" />
        </button>
        <div 
          ref={scrollContainerRef}
          className="flex space-x-2 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              className="flex-shrink-0 w-[320px] h-[180px] bg-gray-800 rounded cursor-pointer movie-card-hover relative"
              onClick={() => onMovieClick?.(movie)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent p-4">
                <h3 className="absolute top-2 left-2 text-sm max-w-[80%]">
                  {movie.title}
                </h3>
                
                {movie.ratingCount > 0 && (
                  <div className="absolute bottom-2 right-2 text-sm font-semibold bg-black/60 px-2 py-1 rounded">
                    <span>{movie.averageRating}</span>
                    <span className="text-gray-300 ml-1">({formatRatingCount(movie.ratingCount)})</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}