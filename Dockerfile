# Fase de construcción
FROM node:18-alpine as build


WORKDIR /app

# Copiar solo package.json y package-lock.json para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Generar la carpeta de producción (dist/)
RUN npm run build > build.log 2>&1 || (cat build.log && echo "❌ ERROR: Build falló" && exit 1)

# Depuración: Mostrar el contenido después del build
RUN echo "📂 Contenido de /app después de build:" && ls -la /app
RUN echo "📂 Contenido de /app/dist después de build:" && ls -la /app/dist || echo "⚠️ La carpeta dist no existe"

# Fase de ejecución (Servidor web)
FROM nginx:stable-alpine

# Depuración: Mostrar archivos en Nginx antes de copiar
RUN echo "📂 Antes de eliminar archivos de Nginx:" && ls -la /usr/share/nginx/html

# Eliminar archivos predeterminados de nginx
RUN rm -rf /usr/share/nginx/html/*

# Depuración: Confirmar eliminación
RUN echo "📂 Después de eliminar archivos de Nginx:" && ls -la /usr/share/nginx/html

# Copiar la aplicación construida desde la fase de build
COPY --from=build /app/dist /usr/share/nginx/html

# Depuración: Verificar que la copia se realizó correctamente
RUN echo "📂 Contenido final de /usr/share/nginx/html:" && ls -la /usr/share/nginx/html
