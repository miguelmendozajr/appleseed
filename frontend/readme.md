# Appleseed Frontend

Aplicación web para la gestión integral de donativos y cumplimiento regulatorio de organizaciones civiles en México.

## Requisitos Previos

- Backend de Appleseed corriendo (ver `../backend/README.md`)

## Configuración y Ejecución

### 1. Navegar al directorio del frontend

```bash
cd frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del directorio `frontend` basándote en el archivo `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3005
```

**Nota:** Las variables de entorno en Next.js que necesitan estar disponibles en el navegador deben tener el prefijo `NEXT_PUBLIC_`.

### 4. Ejecutar la aplicación en modo desarrollo

```bash
npm run dev
```

La aplicación se iniciará en `http://localhost:3000`.

## Estructura del Proyecto

```
frontend/
├── app/
│   ├── dashboard/      # Panel de control de organizaciones
│   ├── login/          # Página de inicio de sesión
│   ├── globals.css     # Estilos globales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Landing page
├── public/             # Archivos estáticos
├── .env               # Variables de entorno (no versionado)
├── next.config.ts     # Configuración de Next.js
├── tailwind.config.ts # Configuración de Tailwind CSS
└── tsconfig.json      # Configuración de TypeScript
```

## Rutas Principales

- `/` - Landing page con información del sistema
- `/login` - Inicio de sesión para organizaciones civiles
- `/dashboard` - Panel de control (requiere autenticación)

## Tecnologías Utilizadas

- **Next.js 16** - Framework React con App Router
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first

## Características

### Landing Page
- Información sobre el sistema Appleseed
- Descripción de características principales
- Sección de cumplimiento regulatorio (SAT, UIF, CLUNI)
- Directorio de abogados especializados

### Autenticación
- Login con RFC y contraseña
- Validación de organizaciones autorizadas
- Almacenamiento de sesión en localStorage

### Dashboard
- Estadísticas de donativos (placeholder)
- Visualización de donantes activos
- Alertas de cumplimiento
- Directorio de abogados con funcionalidad de llamada


## Notas Importantes

- Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend
- Después de modificar el archivo `.env`, es necesario reiniciar el servidor de desarrollo
- La aplicación usa `localStorage` para mantener la sesión del usuario
- Las rutas protegidas redirigen automáticamente a `/login` si no hay sesión activa

