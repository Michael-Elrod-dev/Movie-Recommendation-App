// app/mylist/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import Header from '@/components/Header';
import { MovieRow, type ProcessedMovie } from '@/components/MovieRow';
import { RatingModal } from '@/components/RatingsModal';
import movieData from '@/processed_movies.json';
import { MovieRecommender } from '@/lib/recommender';
import { RatingsStore } from '@/lib/ratingsStore';

const MemoizedMovieRow = React.memo(MovieRow);

export default function MyList() {
  const [recommendedMovies, setRecommendedMovies] = useState<ProcessedMovie[]>([]);
  const [ratedMovies, setRatedMovies] = useState<ProcessedMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<ProcessedMovie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const movies: ProcessedMovie[] = movieData as ProcessedMovie[];

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      const userRatings = RatingsStore.getRatings();

      // Get rated movies
      const rated = movies.filter(movie =>
        userRatings.some(r => r.movieId === movie.movieId)
      );
      setRatedMovies(rated);

      // Check for cached recommendations
      const cachedRecommendations = RatingsStore.getRecommendations();
      
      if (cachedRecommendations) {
        setRecommendedMovies(cachedRecommendations);
      } else if (userRatings.length > 0) {
        // Only fetch new recommendations if we have ratings but no cached recommendations
        const recommender = new MovieRecommender('best_model.pth');
        const recommendations = await recommender.getRecommendations(userRatings);
        setRecommendedMovies(recommendations);
        RatingsStore.setRecommendations(recommendations);
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [movies]);

  useEffect(() => {
    let isMounted = true;

    const runLoadMovies = async () => {
      if (isMounted) await loadMovies();
    };

    runLoadMovies();

    return () => {
      isMounted = false;
    };
  }, [loadMovies]);

  const handleRate = async (movieId: number, rating: number) => {
    RatingsStore.addRating(movieId, rating);
    await loadMovies(); // This will fetch new recommendations since addRating clears the cached ones
  };

  const handleClearRatings = async () => {
    if (window.confirm('Are you sure you want to clear all your ratings?')) {
      RatingsStore.clearRatings();
      setRatedMovies([]);
      setRecommendedMovies([]);
    }
  };

  return (
    <main className="min-h-screen">
      <Header onMovieSelect={setSelectedMovie} />

      <div className="pt-24">
        {ratedMovies.length > 0 && (
          <div className="px-4 mb-4">
            <button
              onClick={handleClearRatings}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Clear Your Ratings
            </button>
          </div>
        )}

        {/* Recommended for You Section */}
        {isLoading ? (
          <div className="px-4 text-gray-400">Loading recommendations...</div>
        ) : recommendedMovies.length > 0 ? (
          <MemoizedMovieRow
            title="Recommended for You"
            movies={recommendedMovies}
            onMovieClick={setSelectedMovie}
          />
        ) : (
          <div className="px-4 text-gray-400 italic">
            Rate some movies to see personalized recommendations
          </div>
        )}

        {/* My Ratings Section */}
        {ratedMovies.length > 0 ? (
          <MemoizedMovieRow
            title="My Ratings"
            movies={ratedMovies}
            onMovieClick={setSelectedMovie}
          />
        ) : (
          <div className="px-4 text-gray-400 italic">
            No rated movies yet. Click on movies to rate them!
          </div>
        )}
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