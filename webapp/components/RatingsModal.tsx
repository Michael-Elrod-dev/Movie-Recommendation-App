// components/RatingModal.tsx
import { ProcessedMovie } from '@/components/MovieRow';

type RatingModalProps = {
    movie: ProcessedMovie;
    onClose: () => void;
    onRate: (movieId: number, rating: number) => void;
};
  
  export function RatingModal({ movie, onClose, onRate }: RatingModalProps) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
          <h3 className="text-xl mb-4">{movie.title}</h3>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  onRate(movie.movieId, star);
                  onClose();
                }}
                className="text-3xl hover:text-yellow-400"
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }