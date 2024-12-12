# api/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
from pydantic import BaseModel
from typing import List
from model.ncf import NCF

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
print("Loading model...")
model_data = torch.load('model/best_model.pth')
user_encoder = model_data['user_encoder']
movie_encoder = model_data['movie_encoder']
movies_df = model_data['movies_df']
embedding_dim = model_data['embedding_dim']

# Get exact dimensions from state dict
num_users = model_data['state_dict']['user_embedding.weight'].shape[0]
num_items = model_data['state_dict']['item_embedding.weight'].shape[0]
print(f"Creating model with {num_users} users and {num_items} items")

# Create model with exact dimensions from saved state
model = NCF(num_users, num_items, embedding_dim)
model.load_state_dict(model_data['state_dict'])
model.eval()

print("Model loaded!")

class Rating(BaseModel):
    movieId: int
    rating: float

class UserRatings(BaseModel):
    ratings: List[Rating]

@app.post("/recommendations")
async def get_recommendations(user_ratings: UserRatings):
    # Use last valid user ID
    temp_user_id = num_users - 1
    
    # Get predictions for all movies
    all_predictions = []
    rated_movie_ids = {r.movieId for r in user_ratings.ratings}

    with torch.no_grad():
        for movie_id in movie_encoder.classes_:
            if movie_id in rated_movie_ids:
                continue

            try:
                movie_idx = movie_encoder.transform([movie_id])[0]
                prediction = model(
                    torch.tensor([temp_user_id]).to(model.user_embedding.weight.device),
                    torch.tensor([movie_idx]).to(model.user_embedding.weight.device)
                )

                all_predictions.append({
                    'movieId': int(movie_id),
                    'predictedRating': float(prediction.item())
                })
            except Exception as e:
                print(f"Error processing movie {movie_id}: {str(e)}")
                continue

    # Sort and get top 20
    top_predictions = sorted(
        all_predictions, 
        key=lambda x: x['predictedRating'], 
        reverse=True
    )[:20]

    # Convert to ProcessedMovie format
    recommendations = []
    for pred in top_predictions:
        movie_data = movies_df[movies_df['movieId'] == pred['movieId']].iloc[0]
        genres = movie_data['genres'].split('|')
        recommendations.append({
            'movieId': pred['movieId'],
            'title': movie_data['title'],
            'genre1': genres[0] if genres else '',
            'genre2': genres[1] if len(genres) > 1 else '',
            'averageRating': pred['predictedRating'],
            'ratingCount': 0
        })

    return recommendations