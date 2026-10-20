#!/usr/bin/env bash
# ==============================================================================
# Script de Despliegue y Actualización en Hostinger VPS
# ==============================================================================

set -e

echo "🚀 Iniciando despliegue de EXPOAPRENDIZAJE..."

# 1. Traer los cambios más recientes del repositorio Git
if [ -d ".git" ]; then
    echo "📥 Descargando últimos cambios desde Git..."
    git pull origin main || git pull origin master
fi

# 2. Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker no está instalado en este VPS."
    echo "Instálalo ejecutando: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# 3. Construir e iniciar el contenedor
echo "🐳 Reconstruyendo e iniciando contenedor..."
if docker compose version &> /dev/null; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi

# 4. Limpieza de imágenes en desuso
echo "🧹 Limpiando imágenes antiguas en desuso..."
docker image prune -f

echo "✅ ¡Despliegue completado exitosamente!"
docker ps --filter "name=expoaprendizaje-web"
