# 🚀 Guía de Despliegue en VPS (Hostinger) con Docker

Este proyecto está configurado para desplegarse mediante **Docker** y **Nginx Alpine**.

---

## 📋 Archivos Docker Incluidos

- `Dockerfile`: Construye una imagen liviana con Nginx Alpine y healthcheck.
- `nginx.conf`: Configuración con compresión Gzip, cabeceras seguras y caché.
- `docker-compose.yml`: Orquestador para levantar y mantener activo el contenedor.
- `deploy.sh`: Script automatizado para desplegar y actualizar en 1 solo comando.
- `.dockerignore`: Optimiza el peso y velocidad de compilación de la imagen.

---

## 🛠️ Paso 1: Subir tus archivos a Git (Desde tu PC)

Si aún no has inicializado el repositorio en esta carpeta:
```bash
git init
git add .
git commit -m "feat: configuracion docker para vps"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

*(Si ya tenías el remoto configurado, simplemente ejecuta:)*
```bash
git add .
git commit -m "feat: configuracion docker para vps"
git push origin main
```

---

## 🖥️ Paso 2: Conectarte a tu VPS de Hostinger por SSH

Desde tu terminal de PowerShell o CMD en Windows:
```bash
ssh root@IP_DE_TU_VPS
```
*(Introduce la contraseña de tu VPS cuando te la solicite).*

---

## 🐳 Paso 3: Instalar Docker en el VPS (Solo la primera vez)

Si tu VPS en Hostinger aún no tiene Docker instalado, ejecuta:
```bash
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker
```

---

## 📥 Paso 4: Clonar el proyecto y ponerlo en marcha

En el servidor VPS:
```bash
# 1. Ve a la carpeta donde guardarás la app
cd /var/www || cd ~

# 2. Clona el repositorio
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git expoaprendizaje
cd expoaprendizaje

# 3. Dar permisos de ejecución al script
chmod +x deploy.sh

# 4. Ejecutar el despliegue
./deploy.sh
```

---

## 🛡️ Paso 5: Abrir el puerto 80 (Firewall UFW)

Asegúrate de permitir el tráfico web en el firewall del VPS:
```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
```

---

## 🌐 Paso 6: Comprobación

Abre tu navegador e ingresa a:
```text
http://IP_DE_TU_VPS
```

---

## 🔄 ¿Cómo actualizar tu proyecto en el futuro?

Cada vez que hagas cambios en tu PC y hagas `git push`:
1. Conéctate a tu VPS: `ssh root@IP_DE_TU_VPS`
2. Ve a la carpeta del proyecto: `cd /var/www/expoaprendizaje`
3. Ejecuta:
   ```bash
   ./deploy.sh
   ```
El script descargará los cambios de Git y recreará el contenedor automáticamente sin pérdida de servicio.
