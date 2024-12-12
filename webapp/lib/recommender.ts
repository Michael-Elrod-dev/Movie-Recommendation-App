import { ProcessedMovie } from '@/components/MovieRow';

export class MovieRecommender {
  constructor(private modelPath: string) {}

  async getRecommendations(
    userRatings: { movieId: number; rating: number }[]
  ): Promise<ProcessedMovie[]> {
    try {
      // Use window.location.hostname to get the current host
      const host = window.location.hostname;
      const url = `http://${host}:8000/recommendations`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ratings: userRatings }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}