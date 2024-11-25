// Simple local storage based ratings store
export class RatingsStore {
    private static STORAGE_KEY = 'user_ratings';
  
    static getRatings(): { movieId: number; rating: number }[] {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  
    static addRating(movieId: number, rating: number) {
      const ratings = this.getRatings();
      const existingIndex = ratings.findIndex(r => r.movieId === movieId);
      
      if (existingIndex >= 0) {
        ratings[existingIndex].rating = rating;
      } else {
        ratings.push({ movieId, rating });
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ratings));
    }
  }