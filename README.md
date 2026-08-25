# EcoHome Store - Backend y Panel Web

Este proyecto es una solución que incluye un backend protegido por JWT y un panel de administración web en React. Cuenta con trazabilidad de operaciones en base de datos y comunicación en tiempo real.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:
- [Docker](https://www.docker.com/) y Docker Compose (para la base de datos).
- [Node.js](https://nodejs.org/) (v16 o superior).

---

## 🚀 Paso 1: Base de Datos (PostgreSQL en Docker)

El sistema utiliza PostgreSQL para garantizar la integridad referencial y la auditoría de los datos.

1. Levanta el contenedor de la base de datos (si usas Docker Compose):
   ```bash
   docker-compose up -d
   ```
   *(Si usas un contenedor manual, asegúrate de iniciarlo con `docker start <nombre_contenedor>` y exponer el puerto `5432`).*

2. Script de Base de Datos y Datos de Prueba (Seeders)

   Para facilitar la configuración inicial y la revisión del proyecto, se incluye un script SQL unificado. Este archivo no solo contiene la estructura DDL para crear las tablas (`users`, `products` y `messages`), sino que también incluye la inserción de **datos de prueba iniciales**. 
   
   Estos datos pre-cargados permiten evaluar inmediatamente el funcionamiento del catálogo, la auditoría de productos y la visualización de mensajes en el chat corporativo interno sin necesidad de registros manuales.
   
   Puedes encontrar el script completo y listo para ejecutarse en tu gestor de base de datos en el siguiente enlace del repositorio:
   
   📄 **[Ver script SQL: backend/config/CREATE.sql](https://github.com/sebas0126/EcoHome/blob/master/backend/config/CREATE.sql)**
   
   *(Nota de seguridad: Los usuarios de prueba generados en el script requieren que sus contraseñas sean encriptadas con `bcrypt` desde el código para poder iniciar sesión con ellos en el entorno local, se recomienda crear los usuarios directamente desde Postman).*

---

## ⚙️ Paso 2: Backend (Node.js & Express)

El servidor centraliza la lógica de negocio, la autenticación (JWT) y las conexiones WebSockets.

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno. Crea un archivo `.env` en la raíz del backend con las siguientes credenciales (ajusta según tu configuración):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_NAME=ecohome
   JWT_SECRET=tu_clave_secreta_super_segura
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```
   *(El servidor debería indicar que está corriendo en el puerto 3000).*

---

## 💻 Paso 3: Frontend Web (React)

El panel web permite la gestión del catálogo y acceso al chat corporativo interno.

1. Abre una **nueva terminal** y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   *(Si usaste Create React App, el comando será `npm start`).*
4. Abre tu navegador en `http://localhost:5173` (o el puerto que te indique la terminal) e inicia sesión.

---

## 🔌 Rutas de la API y Eventos Socket

### Endpoints REST (HTTP)
Todas las rutas privadas requieren el envío del JWT en la cabecera: `Authorization: Bearer <token>`.

- **`POST /auth/login`**: Valida las credenciales del usuario y devuelve el token JWT.
- **`GET /users/me/stats`**: Retorna el nombre del usuario autenticado y el contador de productos creados por él.
- **`GET /products`**: Obtiene el listado completo del catálogo, incluyendo el nombre del creador de cada producto.
- **`POST /products`**: Crea un nuevo producto y guarda automáticamente el ID del usuario que lo creó (extraído del token).

### Eventos Socket.IO (Chat Interno)
Gestionan la comunicación bidireccional en tiempo real para el módulo de chat:

- **`connection` / `disconnect`**: Registra la entrada y salida de clientes en el servidor de WebSockets.
- **`send_message`**: Emitido desde el cliente (React) hacia el servidor, conteniendo el texto del nuevo mensaje y validando la identidad del emisor.
- **`new_message`**: Emitido desde el servidor hacia todos los clientes conectados para actualizar sus pantallas de chat instantáneamente.

---

## 🛠️ Solución de Problemas Frecuentes

- **Error de base de datos en el backend:** Asegúrate de que el contenedor de Docker esté corriendo (verifica con `docker ps`) y que las credenciales en el archivo `.env` del backend coincidan.
- **Los productos no se actualizan en la tabla:** Comprueba que estás enviando el token JWT correctamente en las cabeceras (`Authorization: Bearer <token>`) de cada petición POST y GET.
- **El chat no actualiza en tiempo real:** Verifica en la consola del navegador que el cliente de Socket.IO se esté conectando correctamente al puerto 3000 (o el configurado en tu `.env`) y que no haya errores de CORS en el backend.
