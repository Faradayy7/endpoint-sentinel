# Endpoint Sentinel QA 🛡️

Proyecto de automatización de pruebas QA para el endpoint `/api/media` usando Playwright Test y JavaScript.

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Token de API válido
- URL base de la API

## 🚀 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar navegadores de Playwright

```bash
npm run install:browsers
```

### 3. Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus valores reales:
   ```bash
   # API Configuration (REQUERIDO - Cambiar por tus valores reales)
   API_BASE_URL=https://tu-api-domain.com
   API_TOKEN=tu-token-aqui
   ```

## 🧪 Ejecutar Pruebas

### Comandos básicos

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar solo pruebas smoke (rápidas)
npm run test:smoke

# Ejecutar pruebas con interfaz visual
npm run test:ui

# Ejecutar pruebas en modo headed (ver navegador)
npm run test:headed

# Ejecutar solo pruebas del endpoint media
npm run test:media
```

### Comandos avanzados

```bash
# Ejecutar con debug
npm run test:debug

# Ver reporte de resultados
npm run test:report

# Ejecutar pruebas específicas
npx playwright test tests/api/media.smoke.spec.js
```

## 📁 Estructura del Proyecto

```
endpoint-sentinel-qa/
├── tests/
│   ├── api/
│   │   ├── media.spec.js           # Pruebas principales del endpoint /api/media
│   │   └── media.smoke.spec.js     # Pruebas smoke (rápidas)
│   ├── config/
│   │   └── environment.js          # Configuración centralizada
│   ├── utils/
│   │   ├── api-client.js          # Cliente HTTP simplificado
│   │   └── logger.js              # Utilidad de logging
│   └── fixtures/
│       └── media-test-data.js     # Datos de prueba organizados
├── test-results/                   # Resultados y reportes
├── playwright.config.js           # Configuración de Playwright
├── .env.example                   # Ejemplo de variables de entorno
└── package.json                   # Dependencias y scripts
```

## 🎯 Tipos de Pruebas Incluidas

### Pruebas Smoke (@smoke)
- ✅ Endpoint responde correctamente
- ✅ Autenticación funciona
- ✅ Paginación básica
- ✅ Filtros básicos

### Pruebas Completas
- 🔍 **Filtros de texto**: título, query, descripción
- ⏱️ **Filtros de duración**: min/max duración
- 👁️ **Filtros de vistas**: min/max vistas  
- 📅 **Filtros de fecha**: creación, grabación, disponibilidad
- 🏷️ **Filtros de categorías**: múltiples reglas
- 🔤 **Ordenamiento**: por fecha, título, etc.
- 📄 **Paginación**: límites, saltos
- 🔐 **Autenticación**: header y query parameter

## 🛠️ Parámetros del Endpoint Probados

El endpoint `/api/media` soporta muchos parámetros. Las pruebas cubren:

### Autenticación
- `X-API-Token` header
- `token` query parameter

### Filtros Básicos
- `all` - mostrar todos los campos
- `id` - filtrar por ID específico
- `type` - tipo de media (all, audio, video)
- `status` - estado (OK, TRASH)
- `published` - solo publicados

### Filtros de Texto
- `title` + `title-rule` - filtro de título
- `query` - búsqueda en título
- `description` - búsqueda en descripción

### Filtros Numéricos
- `min_duration` / `max_duration` - duración en segundos
- `min_views` / `max_views` - número de vistas

### Filtros de Fecha
- `created_after` / `created_before` - fecha de creación  
- `recorded_after` / `recorded_before` - fecha de grabación
- `available_from` / `available_until` - fecha de disponibilidad

### Paginación y Ordenamiento
- `limit` - máximo elementos (default: 100)
- `skip` - elementos a saltar (default: 0) 
- `sort` - ordenar por campo (ej: `-date_created`)
- `count` - incluir total de elementos

## 📊 Reportes

Los reportes se generan automáticamente en:
- `test-results/html-report/` - Reporte HTML interactivo
- `test-results/test-results.json` - Resultados en JSON

Para ver el reporte HTML:
```bash
npm run test:report
```

## 🔧 Personalización

### Agregar nuevas pruebas

1. Crea un nuevo archivo `.spec.js` en `tests/api/`
2. Importa las utilidades necesarias:
   ```javascript
   import { test, expect } from '@playwright/test';
   import { ApiClient } from '../utils/api-client.js';
   ```

### Modificar datos de prueba

Edita `tests/fixtures/media-test-data.js` para agregar nuevos casos de prueba.

### Cambiar configuración

Modifica `tests/config/environment.js` para ajustar configuraciones.

## 🐛 Solución de Problemas

### Error: "Faltan configuraciones requeridas"
- Verifica que el archivo `.env` existe
- Asegúrate de que `API_BASE_URL` y `API_TOKEN` estén definidos

### Error: "Cannot find module"
- Ejecuta `npm install`
- Verifica que estás usando Node.js 16+

### Las pruebas fallan con 401/403
- Verifica que el token API es válido
- Confirma que el token tiene permisos para el endpoint

### Timeouts en las pruebas
- Aumenta `TEST_TIMEOUT` en `.env`
- Verifica la conectividad con la API


