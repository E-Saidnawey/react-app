#!/bin/bash

# Portfolio Website Deployment Script for Hetzner Cloud
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCKER_IMAGE_NAME="portfolio-website"
DOCKER_TAG="latest"
CONTAINER_NAME="portfolio-container"
NGINX_PORT="80"

echo -e "${GREEN}🚀 Starting Portfolio Website Deployment${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    echo -e "${YELLOW}📄 Loading environment variables from .env${NC}"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}⚠️  No .env file found. Using default values.${NC}"
fi

# Build the Docker image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker build -t $DOCKER_IMAGE_NAME:$DOCKER_TAG .

# Stop and remove existing container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Run the new container
echo -e "${YELLOW}🚀 Starting new container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    -p $NGINX_PORT:80 \
    -e VITE_API_BASE_URL="${VITE_API_BASE_URL:-https://api.yourdomain.com}" \
    -e VITE_DB_URL="${VITE_DB_URL}" \
    -e VITE_PLANT_MONITOR_ENABLED="${VITE_PLANT_MONITOR_ENABLED:-true}" \
    -e VITE_MQTT_BROKER_URL="${VITE_MQTT_BROKER_URL}" \
    --restart unless-stopped \
    $DOCKER_IMAGE_NAME:$DOCKER_TAG

# Wait for container to start
echo -e "${YELLOW}⏳ Waiting for container to start...${NC}"
sleep 5

# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo -e "${GREEN}✅ Container is running successfully!${NC}"
    echo -e "${GREEN}🌐 Portfolio website is available at: http://localhost:$NGINX_PORT${NC}"
    
    # Show container logs
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs $CONTAINER_NAME --tail 20
else
    echo -e "${RED}❌ Container failed to start. Checking logs...${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Optional: Set up SSL with Let's Encrypt (requires domain)
if [ ! -z "$DOMAIN_NAME" ]; then
    echo -e "${YELLOW}🔒 Setting up SSL certificate for $DOMAIN_NAME...${NC}"
    
    # Install certbot if not already installed
    if ! command -v certbot &> /dev/null; then
        echo -e "${YELLOW}📦 Installing certbot...${NC}"
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Obtain SSL certificate
    sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email $EMAIL
    
    echo -e "${GREEN}✅ SSL certificate installed successfully!${NC}"
    echo -e "${GREEN}🔒 Website is now available at: https://$DOMAIN_NAME${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Configure your domain DNS to point to this server"
echo -e "   2. Set up your backend API server"
echo -e "   3. Configure your PostgreSQL database"
echo -e "   4. Update environment variables as needed"
echo -e "   5. Monitor logs with: docker logs $CONTAINER_NAME -f"
