# Rotten Papers

Este proyecto utiliza Docker y Docker Compose para levantar una aplicación con un frontend (Vite), un backend (Django), y una base de datos MySQL. A continuación, se detalla cómo configurar y ejecutar el proyecto.

## Requisitos Previos

Antes de empezar, asegúrate de tener instalados los siguientes programas en tu máquina:

- [Docker](https://www.docker.com/get-started)

## Configuración y Ejecución del Proyecto

Sigue estos pasos para poner en marcha el proyecto completo (frontend, backend y base de datos).

### 1. Clonar el Proyecto

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/josuexsant/Rotten-Papers/
cd Rotten-Papers
````
### 2. Configurar los Contenedores
El archivo docker-compose.yml ya está configurado para manejar tres servicios:

- Frontend (Vite): Escuchando en el puerto 8080.
- Backend (Django): Escuchando en el puerto 8000.
- Base de Datos (MySQL): Escuchando en el puerto 3306, con una semilla inicial de datos.

### 3. Construir y Ejecutar los Servicios
Construye y levanta los servicios utilizando el siguiente comando:

```bash
docker-compose up --build
````

### 4. Acceder a la Aplicación
- Frontend (Vite): Abre tu navegador y ve a http://localhost:8080 para ver el frontend en ejecución.
- Backend (Django): Puedes acceder al backend (Django) en http://localhost:8000.
- Base de Datos (MySQL): Si deseas conectarte a la base de datos MySQL, usa las siguientes credenciales:
  - Host: localhost
  - Puerto: 3306
  - Usuario: user
  - Contraseña: userpassword
  - Base de datos: mydatabase

### 5. Comprobar los Datos Iniciales (Opcional)
Si quieres comprobar que los datos iniciales se han insertado correctamente en la base de datos, puedes conectarte a MySQL:
```bash
mysql -h 127.0.0.1 -P 3306 -u user -p
```
Luego ejecuta los siguientes comandos para verificar los datos:
```bash
USE mydatabase;
SELECT * FROM usuarios;
```
### 6. Detener los Servicios
Para detener los servicios, presiona CTRL + C en la terminal donde se está ejecutando docker-compose up. Si deseas detener y eliminar todos los contenedores, redes y volúmenes, usa el siguiente comando:
```bash
docker-compose down
```
