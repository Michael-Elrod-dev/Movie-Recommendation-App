import { createReadStream } from 'fs'
import path from 'path'
import { parse } from 'csv-parse'

export interface Movie {
  movieId: number
  title: string
  genres: string[]
}

export interface Rating {
  userId: number
  movieId: number
  rating: number
  timestamp: number
}

interface MovieRecord {
  movieId: string
  title: string
  genres: string
}

interface RatingRecord {
  userId: string
  movieId: string
  rating: string
  timestamp: string
}

export async function loadMovies(): Promise<Movie[]> {
  const moviesPath = path.join(process.cwd(), 'ml-32m', 'movies.csv')
  
  return new Promise((resolve, reject) => {
    const movies: Movie[] = []
    
    createReadStream(moviesPath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
      }))
      .on('data', (record: MovieRecord) => {
        movies.push({
          movieId: parseInt(record.movieId),
          title: record.title,
          genres: record.genres.split('|')
        })
      })
      .on('end', () => {
        resolve(movies)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

export async function loadRatings(limit = 10000): Promise<Rating[]> {
  const ratingsPath = path.join(process.cwd(), 'ml-32m', 'ratings.csv')
  
  return new Promise((resolve, reject) => {
    const ratings: Rating[] = []
    let count = 0
    
    createReadStream(ratingsPath)
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
      }))
      .on('data', (record: RatingRecord) => {
        if (count >= limit) {
          return
        }
        
        ratings.push({
          userId: parseInt(record.userId),
          movieId: parseInt(record.movieId),
          rating: parseFloat(record.rating),
          timestamp: parseInt(record.timestamp)
        })
        
        count++
      })
      .on('end', () => {
        resolve(ratings)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}