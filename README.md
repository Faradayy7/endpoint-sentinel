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
# Ejecutar todos los 21 test cases
npm test

# Ejecutar solo el test smoke (TC-001 - configuración inicial)
npm run test:smoke

# Ejecutar con interfaz visual para ver resultados
npm run test:ui

# Ejecutar en modo headed (ver navegador - útil para debug)
npm run test:headed

# Ejecutar solo pruebas del endpoint media (todos los 21 casos)
npm run test:media
```

### Comandos para casos específicos

```bash
# Ejecutar solo un test case específico
npx playwright test -g "TC-API-G-MEDIA-001"

# Ejecutar tests de categorías (TC-017 y TC-018)
npx playwright test -g "without_category"

# Ejecutar tests de filtros (TC-005 al TC-011)
npx playwright test -g "Filtro"

# Ejecutar tests de paginación (TC-004, TC-014, TC-015)
npx playwright test -g "paginación|count"
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

## 🎯 Test Cases Implementados (21 casos completos)

### 📊 Suite Completa: Media API - Pruebas Completas

#### 🚀 Tests de Configuración y Datos Base
- **TC-API-G-MEDIA-001** `@smoke` - Obtener datos iniciales y configurar datos de prueba
  - Recolecta 50 medias para usar en tests posteriores
  - Procesa y almacena IDs, títulos, tipos, categorías, etc.
  - Validación completa de estructura de respuesta `{status: "OK", data: []}`

#### 🔍 Tests de Filtrado por ID y Validación
- **TC-API-G-MEDIA-002** - Filtro por ID específico usando datos reales
  - Toma un ID real del test anterior y busca medias específicas
  - Valida que el filtro `id` funciona correctamente
- **TC-API-G-MEDIA-003** - Validación completa de estructura de respuesta
  - Verifica todos los campos obligatorios: id, title, type, duration, views, etc.
  - Valida tipos de datos y objetos anidados (access_restrictions, meta, thumbnails)

#### 📄 Tests de Paginación y Navegación
- **TC-API-G-MEDIA-004** - Validación de parámetros de paginación
  - Prueba que el parámetro `limit` es respetado correctamente
- **TC-API-G-MEDIA-014** - Paginación segunda página
  - Valida navegación entre páginas usando `skip` y `limit`
- **TC-API-G-MEDIA-015** - Parámetro count para obtener total
  - Prueba el parámetro `count=true` para obtener totales disponibles

#### 🔤 Tests de Búsqueda y Filtros de Texto
- **TC-API-G-MEDIA-005** - Búsqueda por palabra clave del título real
  - Extrae palabras de títulos reales y las busca con `query`
- **TC-API-G-MEDIA-006** - Filtro por título exacto usando datos reales
  - Usa títulos reales con `title` + `title-rule: "is"` para búsquedas exactas
- **TC-API-G-MEDIA-007** - Filtro por título que contiene texto real
  - Busca texto dentro de títulos con `title` + `title-rule: "contains"`

#### ⏱️ Tests de Filtros Numéricos
- **TC-API-G-MEDIA-008** - Filtro por duración basado en datos reales
  - Calcula rangos de duración de datos reales y filtra con `min_duration`/`max_duration`
- **TC-API-G-MEDIA-009** - Filtro por vistas basado en datos reales
  - Usa estadísticas reales de vistas para filtrar con `min_views`

#### 🎬 Tests de Tipo y Clasificación
- **TC-API-G-MEDIA-010** - Filtro por tipo de media usando datos reales
  - Filtra por tipos encontrados (audio, video) usando parámetro `type`

#### 📅 Tests de Filtros de Fecha
- **TC-API-G-MEDIA-011** - Filtro por fecha usando datos reales
  - Usa rangos de fechas reales con `created_after`/`created_before`
- **TC-API-G-MEDIA-012** - Filtro por fecha de creación posterior
  - Filtra medias creadas después de fecha específica
- **TC-API-G-MEDIA-013** - Ordenamiento por fecha descendente
  - Valida ordenamiento con `sort` por fecha descendente

#### 🏷️ Tests de Tags y Categorías
- **TC-API-G-MEDIA-016** - Filtro por tag usando datos reales
  - Filtra por tags encontrados en datos reales con `tag` + `tags-rule: "in_any"`
- **TC-API-G-MEDIA-017** - Filtro sin categoría usando `without_category=true`
  - **Análisis detallado**: Cuenta medias CON y SIN categorías
  - **Validación estricta**: Solo debe retornar medias sin categorías
  - **Logging avanzado**: Estadísticas y ejemplos de lo encontrado
- **TC-API-G-MEDIA-018** - Filtro completo usando `without_category=false`
  - **Comportamiento correcto**: Incluye TODAS las medias (con y sin categorías)
  - **Análisis estadístico**: Top 5 categorías más comunes
  - **Muestra de datos**: Ejemplos de medias con sus categorías

#### 🔒 Tests de Estado de Publicación
- **TC-API-G-MEDIA-019** - Filtro por estado de publicación
  - Filtra con `is_published=true` y analiza estados de inicialización
  - **Breakdown detallado**: Publicadas+Inicializadas, Publicadas+No inicializadas, etc.

#### 🧪 Tests de Validación Avanzada
- **TC-API-G-MEDIA-020** - Validación de campos específicos según respuesta real
  - Valida estructura completa de campos reales de la API
  - **Campos específicos**: access_restrictions, access_rules, preview, show_info
  - **Validaciones técnicas**: protocols.hls (URLs .m3u8), meta (resoluciones), thumbnails
  - **Arrays especializados**: tracks, playlist, meta con codec/resolution

#### 🔄 Tests de Casos Complejos
- **TC-API-G-MEDIA-021** - Combinación de filtros usando datos reales
  - Combina múltiples filtros: `type`, `query`, `id` simultáneamente
  - Valida que los filtros funcionan en conjunto

## ✨ Características Especiales del Framework

### 🧠 Inteligencia de Datos Reales
- **Test Data Manager**: Procesa datos reales de la API para usar en tests posteriores
- **Adaptabilidad**: Los tests se adaptan a los datos disponibles (skip si no hay datos)
- **Reutilización**: Un test inicial recolecta datos que todos los demás reutilizan

### 📊 Logging y Analytics Avanzados
- **Análisis detallado**: Cada test incluye estadísticas y breakdowns
- **Logging con emojis**: Fácil de leer y entender en los reportes
- **Evidencia completa**: Muestra qué encontró, qué validó y por qué pasó/falló

### 🎯 Validaciones Inteligentes
- **Estructura real**: Valida campos que realmente existen en la API
- **Flexibilidad**: Se adapta a diferentes formatos de respuesta
- **Cobertura completa**: Desde campos básicos hasta estructuras complejas anidadas

### 🔄 Arquitectura Modular
- **ApiClient**: Cliente HTTP especializado con validaciones JSON
- **Logger**: Sistema de logging estructurado con niveles
- **TestDataManager**: Gestor inteligente de datos de prueba
- **Fixtures**: Datos organizados y reutilizables

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

## 📊 Resultados y Métricas

### 📈 Performance Esperado
- **21 test cases** ejecutados en aproximadamente **9-12 segundos**
- **1 test skipped** (configuración inicial que siempre se ejecuta)
- **Cobertura completa** de todos los parámetros principales del endpoint

### 📋 Ejemplo de Salida de Logs
```
📊 ANÁLISIS DETALLADO - without_category=false:
   🔢 Total de medias obtenidas: 100
   ✅ Medias CON categorías: 50  
   ✅ Medias SIN categorías (también esperadas): 50
   📈 Top categorías encontradas:
      1. "Deportes": 15 medias
      2. "Noticias": 12 medias  
      3. "Entretenimiento": 8 medias
   ✅ Verificación exitosa: Se encontraron 100 medias total
```

### 🎯 Qué Valida Cada Test
- **Estructura de respuesta**: JSON válido con `{status: "OK", data: []}`
- **Tipos de datos**: Strings, numbers, arrays, booleans según esperado
- **Lógica de filtros**: Que cada parámetro funcione como se espera
- **Casos edge**: Datos vacíos, límites, combinaciones complejas

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

## 📝 Logs y Debug

Para ver logs detallados:
```bash
# Activar debug en .env
ENABLE_DEBUG_LOGS=true
LOG_LEVEL=debug
```

O ejecutar con debug específico:
```bash
DEBUG=pw:api npm test
```

## 🔄 Próximos Pasos

Este proyecto está estructurado para ser escalable. Puedes:

1. **Agregar más endpoints**: Crear nuevos archivos `.spec.js`
2. **Añadir validaciones**: Verificar estructura de respuesta
3. **Integrar CI/CD**: Usar en GitHub Actions, Jenkins, etc.
4. **Añadir métricas**: Performance, tiempo de respuesta
5. **Crear test data**: Generators para datos de prueba

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-prueba`)
3. Commit tus cambios (`git commit -am 'Agregar nueva prueba'`)
4. Push a la rama (`git push origin feature/nueva-prueba`)
5. Crea un Pull Request

---

¡Felices pruebas! 🎉
