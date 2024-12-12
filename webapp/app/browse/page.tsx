// app/browse/page.tsx
'use client'
import { useState } from 'react';
import Header from '@/components/Header';
import { MovieRow, type ProcessedMovie } from '@/components/MovieRow';
import { RatingModal } from '@/components/RatingsModal';
import { RatingsStore } from '@/lib/ratingsStore';
import movieData from '@/processed_movies.json';

export default function Browse() {
  const [selectedMovie, setSelectedMovie] = useState<ProcessedMovie | null>(null);
  const movies: ProcessedMovie[] = movieData as ProcessedMovie[];

  // Get top rated movies
  const topRatedMovies = [...movies]
    .filter(movie => movie.ratingCount >= 100)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 10);

  // Group remaining movies by primary genre
  const moviesByGenre: { [key: string]: ProcessedMovie[] } = {};
  movies.forEach(movie => {
    if (movie.genre1) {
      if (!moviesByGenre[movie.genre1]) {
        moviesByGenre[movie.genre1] = [];
      }
      moviesByGenre[movie.genre1].push(movie);
    }
  });

  const handleRate = (movieId: number, rating: number) => {
    RatingsStore.addRating(movieId, rating);
  };

  return (
    <main className="min-h-screen">
      <Header onMovieSelect={setSelectedMovie} />
      
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-gray-800 w-full">
        <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-background">
          <h2 className="text-4xl font-bold mb-4">{movies[0]?.title || 'Featured Title'}</h2>
          <p className="text-lg max-w-2xl">Movie description will go here...</p>
        </div>
      </div>

      {/* Movie rows */}
      <div className="relative z-10">
        <MovieRow 
          title="Top Rated Movies" 
          movies={topRatedMovies}
          onMovieClick={setSelectedMovie}
        />
        
        {Object.entries(moviesByGenre).map(([genre, genreMovies]) => (
          <MovieRow 
            key={genre} 
            title={genre} 
            movies={genreMovies.slice(0, 10)}
            onMovieClick={setSelectedMovie}
          />
        ))}
      </div>

      {selectedMovie && (
        <RatingModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onRate={handleRate}
        />
      )}
    </main>
  );
}