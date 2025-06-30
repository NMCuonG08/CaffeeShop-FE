# CafeShop Frontend - Docker Setup

This repository contains the React frontend for the CafeShop application, containerized with Docker for easy deployment and development.

## 🐳 Docker Files Overview

- `Dockerfile` - Production build with Nginx
- `Dockerfile.dev` - Development build with hot reload
- `docker-compose.yml` - Production deployment
- `docker-compose.dev.yml` - Development environment
- `nginx.conf` - Nginx configuration for production
- `.dockerignore` - Files to exclude from Docker build

## 🚀 Quick Start

### Production Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# Or build and run manually
docker build -t cafeshop-frontend .
docker run -p 3000:80 cafeshop-frontend
```

### Development Environment

```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# Or run development server manually
docker build -f Dockerfile.dev -t cafeshop-frontend-dev .
docker run -p 5173:5173 -v $(pwd):/app cafeshop-frontend-dev
```

## 📋 Available Commands

### Production Commands
```bash
# Build production image
docker build -t cafeshop-frontend .

# Run production container
docker run -p 3000:80 cafeshop-frontend

# Start full production stack
docker-compose up -d

# Stop production stack
docker-compose down

# View logs
docker-compose logs -f frontend
```

### Development Commands
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Rebuild development image
docker-compose -f docker-compose.dev.yml up --build

# View development logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

### Utility Commands
```bash
# Remove all containers and volumes
docker-compose down -v

# Remove images
docker rmi cafeshop-frontend cafeshop-frontend-dev

# Clean up Docker system
docker system prune -a
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_GRAPHQL_URL=http://localhost:3001/graphql

# Authentication
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Payment
VITE_VNPAY_MERCHANT_ID=your-vnpay-merchant-id
VITE_MOMO_PARTNER_CODE=your-momo-partner-code

# Other configurations
VITE_APP_NAME=CafeShop
VITE_APP_VERSION=1.0.0
```

### Docker Compose Override

Create a `docker-compose.override.yml` for local customizations:

```yaml
version: '3.8'
services:
  frontend:
    environment:
      - VITE_API_URL=http://your-custom-backend:3000
    ports:
      - "8080:80"  # Custom port
```

## 🏗️ Build Process

### Production Build

1. **Stage 1 (Builder):**
   - Uses Node.js 18 Alpine
   - Installs dependencies
   - Builds the React application with Vite
   - Optimizes for production

2. **Stage 2 (Runtime):**
   - Uses Nginx Alpine
   - Copies built files from Stage 1
   - Serves static files with Nginx
   - Includes custom Nginx configuration

### Development Build

- Uses Node.js 18 Alpine
- Mounts source code as volume
- Runs Vite dev server with hot reload
- Exposes port 5173

## 🌐 Nginx Configuration

The production build uses a custom Nginx configuration that includes:

- **SPA Support:** Handles React Router with `try_files`
- **Gzip Compression:** Optimizes file transfer
- **Security Headers:** Adds security headers
- **Caching:** Sets appropriate cache headers for static assets
- **API Proxy:** Proxies API calls to backend (adjust as needed)
- **Health Checks:** Endpoint for container health monitoring

## 📊 Container Health

Both production and development containers include health checks:

- **Production:** HTTP health check on port 80
- **Development:** Process health check for Vite dev server

Monitor health with:
```bash
docker ps  # Check container status
docker-compose ps  # Check compose services
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Use different ports in docker-compose.yml
   ports:
     - "8080:80"
   ```

2. **Permission Issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

3. **Node Modules Issues:**
   ```bash
   # Remove node_modules and rebuild
   docker-compose down
   docker volume rm cafeshop_frontend_node_modules
   docker-compose up --build
   ```

4. **API Connection Issues:**
   - Check `VITE_API_URL` in environment variables
   - Ensure backend service is running
   - Verify network connectivity between containers

### Debugging

```bash
# Access container shell
docker exec -it cafeshop-frontend sh

# View container logs
docker logs cafeshop-frontend -f

# Check nginx configuration
docker exec cafeshop-frontend nginx -t
```

## 🚀 Deployment

### Production Deployment

1. **Build and tag image:**
   ```bash
   docker build -t your-registry/cafeshop-frontend:latest .
   ```

2. **Push to registry:**
   ```bash
   docker push your-registry/cafeshop-frontend:latest
   ```

3. **Deploy with docker-compose:**
   ```bash
   docker-compose up -d
   ```

### CI/CD Pipeline Example

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t cafeshop-frontend .
        
      - name: Deploy to production
        run: docker-compose up -d
```

## 📝 Notes

- The production build optimizes for performance and security
- Development build prioritizes fast rebuilds and debugging
- Nginx serves static files efficiently in production
- All sensitive data should be in environment variables
- Regular security updates are recommended for base images

## 🤝 Contributing

1. Use the development environment for changes
2. Test both development and production builds
3. Update Docker configurations as needed
4. Document any new environment variables
