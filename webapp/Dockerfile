FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

# Install Python and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    python3.10 \
    python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm install

# Copy Python requirements and install
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Build the Next.js app
RUN npm run build

# Create and configure start script
RUN echo '#!/bin/bash\nuvicorn api.app:app --host 0.0.0.0 --port 8000 & npm start' > start.sh
RUN chmod +x start.sh

# Expose ports
EXPOSE 3000 8000

# Start both servers
CMD ["./start.sh"]