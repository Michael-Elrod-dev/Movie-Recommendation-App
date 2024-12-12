# Movie Recommender App

## Prerequisites
- Docker Desktop (https://www.docker.com/products/docker-desktop/)
- NVIDIA GPU with updated drivers (for optimal performance)
- NVIDIA Container Toolkit (for GPU support)

## Running the Application

### Steps to Run
1. Open Terminal (Command Prompt on Windows)
2. Navigate to project directory (webapp/)
3. Run these commands:
```bash
docker build -t movieflix .
docker run --gpus all -p 3000:3000 -p 8000:8000 movieflix
```
4. Open your web browser and go to: http://localhost:3000

### Note
- For systems without NVIDIA GPU, remove the `--gpus all` flag from the run command:
```bash
docker run -p 3000:3000 -p 8000:8000 movieflix
```

### Troubleshooting
- If you see "port already in use" errors, make sure no other applications are using ports 3000 or 8000
- To stop the application, press Ctrl+C in the terminal
- If you get GPU-related errors, ensure your NVIDIA drivers are up to date and NVIDIA Container Toolkit is installed
- First time startup may take several minutes while Docker downloads required dependencies