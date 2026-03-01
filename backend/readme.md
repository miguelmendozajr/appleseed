# Appleseed Backend

API REST para la gestión de donativos y cumplimiento regulatorio de organizaciones civiles.

## Configuración y Ejecución

### 1. Navegar al directorio del backend

```bash
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del directorio `backend` basándote en el archivo `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de base de datos:

```env
DB_HOST=tu_host_de_base_de_datos
DB_PORT=tu_puerto_de_base_de_datos
DB_USER=tu_usuario_de_base_de_datos
DB_PASSWORD=tu_contraseña_de_base_de_datos
DB_NAME=tu_nombre_de_base_de_datos
PORT=3005
```

### 4. Ejecutar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3005` (o el puerto que hayas configurado en la variable `PORT`).

## Scripts Disponibles

- `npm run dev` - Ejecuta el servidor en modo desarrollo con nodemon (reinicio automático)

## Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── db/            # Servicio de base de datos
│   ├── handlers/      # Manejadores de peticiones HTTP
│   └── routes/        # Definición de rutas
├── server.js          # Punto de entrada de la aplicación
├── package.json       # Dependencias y scripts
└── .env              # Variables de entorno
```

## Endpoints Disponibles

### Autenticación

- `POST /api/auth/login` - Iniciar sesión de organización civil
  ```json
  {
    "rfc": "RFC_DE_LA_ORGANIZACION",
    "password": "contraseña"
  }
  ```

### Abogados

- `GET /api/lawyers` - Obtener lista de abogados especializados

## Dependencias Principales

- **express** - Framework web
- **mysql2** - Cliente MySQL
- **dotenv** - Gestión de variables de entorno
- **cors** - Middleware para habilitar CORS
- **nodemon** - Reinicio automático en desarrollo

## Notas

- Asegúrate de que la base de datos esté accesible antes de iniciar el servidor
- El servidor utiliza CORS con configuración permisiva para desarrollo
