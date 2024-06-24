# Fase de construcción
FROM node:14-alpine as build

WORKDIR /app

COPY package*.json ./

COPY . .
RUN ls -la /app/dist
RUN /usr/share/nginx/html

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
# Fase de ejecución
FROM nginx:stable-alpine

# Copiar solo los archivos de construcción desde la fase de construcción
COPY --from=build /app/dist /usr/share/nginx/html
