import pandas as pd
import json
from pathlib import Path

def process_movies_data():
    print("Loading data files...")
    # Load movies and ratings
    movies_df = pd.read_csv('webapp/ml-32m/movies.csv')
    ratings_df = pd.read_csv('webapp/ml-32m/ratings.csv')

    print("Calculating rating statistics...")
    # Calculate average ratings and counts
    rating_stats = ratings_df.groupby('movieId').agg({
        'rating': ['mean', 'count']
    }).reset_index()
    rating_stats.columns = ['movieId', 'averageRating', 'ratingCount']
    rating_stats['averageRating'] = rating_stats['averageRating'].round(1)

    print("Processing genres...")
    # Function to get first two genres (or less if movie has fewer genres)
    def get_genres(genres_str):
        genres = genres_str.split('|')
        return {
            'genre1': genres[0] if len(genres) > 0 else '',
            'genre2': genres[1] if len(genres) > 1 else ''
        }

    # Apply genre processing
    genres_df = pd.DataFrame([
        get_genres(genres) for genres in movies_df['genres']
    ])

    # Combine movies with genres
    movies_df = pd.concat([movies_df, genres_df], axis=1)

    print("Merging data...")
    # Merge with ratings data
    final_df = movies_df.merge(rating_stats, on='movieId', how='left')

    # Fill NaN values for movies with no ratings
    final_df['averageRating'] = final_df['averageRating'].fillna(0.0)
    final_df['ratingCount'] = final_df['ratingCount'].fillna(0).astype(int)

    # Sort by rating count to get most rated movies
    final_df = final_df.sort_values('ratingCount', ascending=False)

    # Take top 1 million movies (or all if less than 1 million)
    final_df = final_df.head(1000000)

    # Select and organize final columns
    processed_data = final_df[[
        'movieId', 
        'title', 
        'genre1',
        'genre2',
        'averageRating',
        'ratingCount'
    ]].to_dict('records')

    print("Saving processed data...")
    # Create data directory if it doesn't exist
    Path('data').mkdir(exist_ok=True)

    # Save to JSON file
    with open('data/processed_movies.json', 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, indent=2, ensure_ascii=False)

    print(f"Processing complete. Total movies processed: {len(processed_data)}")

if __name__ == "__main__":
    try:
        process_movies_data()
    except Exception as e:
        print(f"Error occurred: {str(e)}")