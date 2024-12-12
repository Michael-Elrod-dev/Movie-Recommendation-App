# docker_restart.ps1

Write-Host "`nStopping all Docker containers..."
docker ps -q | ForEach-Object { 
    Write-Host "Stopping container $_"
    docker stop $_ 
}

Write-Host "`nPorts should now be free."
Write-Host "You can now run: docker run --gpus all -p 3000:3000 -p 8000:8000 movie-recommender"