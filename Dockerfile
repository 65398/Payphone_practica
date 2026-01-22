# Imagen base con Node.js
FROM node:25

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar archivos de dependencias primero (mejores builds)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa la app
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]