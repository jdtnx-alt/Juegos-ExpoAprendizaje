# ==============================================================================
# Dockerfile - EXPOAPRENDIZAJE (Servidor Web Nginx Alpine)
# ==============================================================================
FROM nginx:alpine

LABEL maintainer="EXPOAPRENDIZAJE"

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar todos los archivos estáticos de la aplicación
COPY . /usr/share/nginx/html/

# Exponer el puerto HTTP estándar
EXPOSE 80

# Comprobación de estado para verificar que Nginx responde correctamente
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
