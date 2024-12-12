// ratingsStore.ts
import { ProcessedMovie } from '@/components/MovieRow';

export class RatingsStore {
    private static RATINGS_KEY = 'user_ratings';
    private static RECOMMENDATIONS_KEY = 'user_recommendations';
  
    static getRatings(): { movieId: number; rating: number }[] {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.RATINGS_KEY);
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
      
      localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratings));
      // Clear stored recommendations when new rating is added
      this.clearRecommendations();
    }

    static clearRatings() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.RATINGS_KEY);
            this.clearRecommendations();
        }
    }

    static getRecommendations(): ProcessedMovie[] | null {
        if (typeof window === 'undefined') return null;
        
        const stored = localStorage.getItem(this.RECOMMENDATIONS_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    static setRecommendations(recommendations: ProcessedMovie[]) {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.RECOMMENDATIONS_KEY, JSON.stringify(recommendations));
        }
    }

    static clearRecommendations() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.RECOMMENDATIONS_KEY);
        }
    }
}