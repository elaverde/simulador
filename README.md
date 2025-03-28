# Simulador de Créditos Online

Simula tu crédito en segundos. Ingresa el monto y plazo para calcular tu préstamo y encontrar la mejor tasa de interés.

## 🚀 Despliegue con Docker

Sigue estos pasos para construir y ejecutar el contenedor Docker.

### 📦 Construcción de la imagen

```sh
docker build -t simulador-creditos .
```

### 🚀 Ejecución del contenedor

```sh
docker run -d -p 8080:8080 --name simulador-creditos simulador-creditos
```

Esto iniciará un servidor en el puerto 8080.

Verificar ejecución

Abre un navegador y accede a:

```
http://localhost:8080
```

Detener y eliminar el contenedor

Para detener el contenedor:

```sh
docker stop simulador-creditos
```

Para eliminar el contenedor:

```sh
docker rm simulador-creditos
```

# 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
