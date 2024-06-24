# Fase de construcción
FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY dist /app

RUN npm run build

# Paso de depuración para listar los archivos
RUN ls -la /app

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

# Fase de ejecución
FROM nginx:stable-alpine

# Copiar solo los archivos de construcción desde la fase de construcción
COPY --from=build /app /usr/share/nginx/html
