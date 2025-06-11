#!/bin/bash

# 🚀 Script de Configuración Completa para VPS Hostinger
# Ejecutar como root: sudo bash vps-setup.sh

set -e  # Parar si hay errores

echo "🚀 Configurando VPS para Next.js + PostgreSQL + Nginx..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Actualizar sistema
print_message "Actualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Node.js 18.x
print_message "Instalando Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verificar instalación de Node.js
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_message "Node.js instalado: $NODE_VERSION"
print_message "NPM instalado: $NPM_VERSION"

# 3. Instalar PostgreSQL
print_message "Instalando PostgreSQL..."
apt-get install -y postgresql postgresql-contrib

# 4. Instalar herramientas del sistema
print_message "Instalando herramientas del sistema..."
apt-get install -y git curl wget vim nginx ufw certbot python3-certbot-nginx htop

# 5. Instalar PM2 globalmente
print_message "Instalando PM2..."
npm install -g pm2

# 6. Configurar firewall
print_message "Configurando firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 3000
ufw --force enable

# 7. Configurar PostgreSQL
print_message "Configurando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# 8. Crear usuario de aplicación
print_message "Creando usuario appuser..."
if ! id "appuser" &>/dev/null; then
    useradd -m -s /bin/bash appuser
    usermod -aG sudo appuser
    print_message "Usuario appuser creado"
else
    print_warning "Usuario appuser ya existe"
fi

# 9. Crear directorios necesarios
print_message "Creando directorios de aplicación..."
mkdir -p /home/appuser/app
mkdir -p /home/appuser/logs
mkdir -p /home/appuser/backups
chown -R appuser:appuser /home/appuser

# 10. Configurar Nginx básico
print_message "Configurando Nginx..."
systemctl start nginx
systemctl enable nginx

# 11. Crear base de datos PostgreSQL
print_message "Configurando base de datos..."
sudo -u postgres psql << EOF
CREATE USER lovilike_user WITH PASSWORD 'TempPassword123!';
CREATE DATABASE lovilike_db OWNER lovilike_user;
GRANT ALL PRIVILEGES ON DATABASE lovilike_db TO lovilike_user;
GRANT ALL ON SCHEMA public TO lovilike_user;
\q
EOF

# 12. Verificar servicios
print_message "Verificando servicios..."
systemctl status nginx --no-pager -l
systemctl status postgresql --no-pager -l

# 13. Mostrar información del sistema
echo ""
echo "🎉 ¡Configuración del VPS completada!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Servidor web: Nginx (puerto 80/443)"
echo "🗄️  Base de datos: PostgreSQL"
echo "⚡ Runtime: Node.js $NODE_VERSION"
echo "🔧 Gestor de procesos: PM2"
echo "🔥 Firewall: UFW habilitado"
echo "👤 Usuario de aplicación: appuser"
echo "📁 Directorio de aplicación: /home/appuser/app"
echo "📊 Logs: /home/appuser/logs"
echo "🔒 Base de datos: lovilike_db (usuario: lovilike_user)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo "1. Cambiar al usuario appuser: su - appuser"
echo "2. Clonar el repositorio en /home/appuser/app"
echo "3. Configurar variables de entorno (.env)"
echo "4. Ejecutar el script de deployment: bash deploy-vps.sh"
echo "5. Configurar Nginx con el dominio específico"
echo "6. Configurar SSL con certbot"
echo ""
echo "⚠️  IMPORTANTE: Cambiar la contraseña por defecto de PostgreSQL:"
echo "   sudo -u postgres psql -c \"ALTER USER lovilike_user PASSWORD 'tu_password_seguro';\""
echo ""