# Imagen base de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Instalar http-server para servir los archivos HTML/JS
RUN npm install -g http-server

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["http-server", "-p", "3000"]
