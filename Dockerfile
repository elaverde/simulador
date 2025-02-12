# Fase de construcción
FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Paso de depuración para listar los archivos y establecer permisos
RUN ls -la /app && chmod -R 755 /app/dist

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

# Fase de ejecución
FROM nginx:stable-alpine

# Paso de depuración para listar los archivos en el directorio de nginx y establecer permisos
RUN ls -la /usr/share/nginx && chmod -R 755 /usr/share/nginx/html

# Copiar solo los archivos de construcción desde la fase de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Establecer permisos en el directorio de destino
RUN chmod -R 755 /usr/share/nginx/html
