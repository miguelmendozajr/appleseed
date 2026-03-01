# Appleseed

**Sembrando la semilla de la justicia en México**

Sistema integral de gestión de donativos y cumplimiento regulatorio para Organizaciones de la Sociedad Civil (OSC). Appleseed automatiza el cumplimiento fiscal, la prevención de lavado de dinero y la transparencia, centralizando información y generando alertas para reportes ante SAT, UIF y CLUNI.

## 🎯 Objetivo del Proyecto

Las OSC en México enfrentan una carga administrativa significativa al capturar información duplicada en múltiples portales gubernamentales, con alto riesgo de error humano y multas superiores a $5,000,000 MXN. Appleseed soluciona esto mediante:

- ✅ **Gestión centralizada** de donantes y donativos
- ✅ **Monitoreo automático** de umbrales legales (1,605 UMAs, efectivo >$100,000 MXN)
- ✅ **Generación automática** de CFDI y avisos regulatorios
- ✅ **Sistema de alertas** para cumplimiento y fechas límite
- ✅ **Resguardo seguro** de información por 10 años
- ✅ **Directorio de abogados** especializados en PLD/FT

## 🚀 Setup del Proyecto

### Para el Development Team

Para configurar y ejecutar el proyecto localmente, sigue estos pasos en orden:

1. **Backend (API REST)**
   - Ve a la carpeta `backend/` y sigue las instrucciones en [`backend/readme.md`](backend/readme.md)
   - Asegúrate de configurar correctamente el archivo `.env` con las credenciales de la base de datos

2. **Frontend (Aplicación Web)**
   - Ve a la carpeta `frontend/` y sigue las instrucciones en [`frontend/readme.md`](frontend/readme.md)
   - Configura el archivo `.env` con la URL del backend (por defecto `http://localhost:3005`)

**Importante:** El backend debe estar ejecutándose antes de iniciar el frontend para que la aplicación funcione correctamente.

## 📁 Estructura del Proyecto

```
appleseed/
├── backend/          # API REST (Node.js + Express + MySQL)
│   └── README.md    # ← Instrucciones de setup del backend
├── frontend/        # Aplicación web (Next.js + React + TypeScript)
│   └── README.md    # ← Instrucciones de setup del frontend
└── README.md        # Este archivo
```

## 👥 Equipo 2

**Development Team**
- Patricia Serna Aceves
- Margarita Zavaleta Jiménez

**Scrum Master**
- Carlos Alejandro Meza 

**Product Owner**
- Miguel Mendoza Jaidar
