# Usamos una versión ligera de Node.js
FROM node:18-bullseye-slim

# Creamos la carpeta de trabajo
WORKDIR /app

# Copiamos primero el package.json para instalar dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto de tu código
COPY . .

# Hugging Face exige usar el puerto 7860
EXPOSE 7860

# El comando para arrancar tu API
CMD ["npm", "start"]