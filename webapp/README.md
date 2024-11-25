# Movie Recommender App

## Running the Application

### Prerequisites
- Install Docker Desktop from https://www.docker.com/products/docker-desktop/

### Steps to Run
1. Open Terminal (Command Prompt on Windows)
2. Navigate to project directory
3. Run these commands:
```
docker build -t movie-recommender .
docker run -p 3000:3000 -p 8000:8000 movie-recommender
```
4. Open your web browser and go to: http://localhost:3000

### Troubleshooting
- If you see "port already in use" errors, make sure no other applications are using ports 3000 or 8000
- To stop the application, press Ctrl+C in the terminal
```

To test this locally:
1. Install Docker Desktop
2. Build: `docker build -t movie-recommender .`
3. Run: `docker run -p 3000:3000 -p 8000:8000 movie-recommender`

Your entire app should now run in a single container with:
- Next.js frontend on port 3000
- Python backend on port 8000
- All dependencies included
- Model file packaged inside