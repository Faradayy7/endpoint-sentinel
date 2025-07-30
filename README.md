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

###  Casos de Prueba

**ID del Caso de Prueba**: TC-API-G-MEDIA-001  
**Módulo**: API – Media  
**Tipo de Prueba**: Smoke (Positiva)  
**Objetivo**: Obtener datos iniciales del endpoint y configurar datos de prueba para casos posteriores.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con limit=50
  2. Validar código de respuesta = 200
  3. Validar estructura {status: "OK", data: []}
  4. Procesar y almacenar datos (IDs, títulos, tipos, categorías)
**Datos de prueba**: Parámetros básicos con limit=50  
**Resultado esperado**: Respuesta 200, estructura válida y datos procesados correctamente.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-002  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por ID específico usando datos reales.  
**Precondiciones**: TC-001 ejecutado exitosamente, datos disponibles.  
**Pasos**:
  1. Obtener ID real de datos procesados
  2. Hacer GET a /api/media con parámetro id={ID_real}
  3. Validar código de respuesta = 200
  4. Validar que resultado contiene el ID buscado
**Datos de prueba**: ID extraído de datos reales  
**Resultado esperado**: Respuesta 200 con media específica encontrada.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-003  
**Módulo**: API – Media  
**Tipo de Prueba**: Contrato (Positiva)  
**Objetivo**: Validar estructura completa de respuesta del endpoint.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con limit=1
  2. Validar código de respuesta = 200
  3. Validar campos obligatorios (id, title, type, duration, views, etc.)
  4. Validar tipos de datos correctos
  5. Validar objetos anidados (access_restrictions, meta, thumbnails)
**Datos de prueba**: Límite de 1 elemento  
**Resultado esperado**: Respuesta 200 con estructura de campos completa y válida.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-004  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar que parámetros de paginación son respetados.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con parámetros de primera página
  2. Validar código de respuesta = 200
  3. Validar que cantidad de elementos respeta el límite establecido
**Datos de prueba**: Parámetros de paginación primera página  
**Resultado esperado**: Respuesta 200 con cantidad correcta de elementos.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-005  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar búsqueda por palabra clave en títulos reales.  
**Precondiciones**: TC-001 ejecutado, títulos disponibles.  
**Pasos**:
  1. Extraer palabra de título real procesado
  2. Hacer GET a /api/media con query={palabra}
  3. Validar código de respuesta = 200
  4. Validar que resultados contienen la palabra buscada
**Datos de prueba**: Palabra extraída de título real  
**Resultado esperado**: Respuesta 200 con medias que contienen la palabra.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-006  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por título exacto usando datos reales.  
**Precondiciones**: TC-001 ejecutado, títulos disponibles.  
**Pasos**:
  1. Obtener título completo real
  2. Hacer GET a /api/media con title={título} y title-rule=is
  3. Validar código de respuesta = 200
  4. Validar coincidencia exacta encontrada
**Datos de prueba**: Título completo real  
**Resultado esperado**: Respuesta 200 con media de título exacto.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-007  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por texto contenido en título.  
**Precondiciones**: TC-001 ejecutado, palabras de títulos disponibles.  
**Pasos**:
  1. Extraer palabra de título real
  2. Hacer GET a /api/media con title={palabra} y title-rule=contains
  3. Validar código de respuesta = 200
  4. Validar que resultados contienen la palabra en título
**Datos de prueba**: Palabra extraída de título real  
**Resultado esperado**: Respuesta 200 con medias que contienen texto en título.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-008  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por rango de duración basado en datos reales.  
**Precondiciones**: TC-001 ejecutado, información de duración disponible.  
**Pasos**:
  1. Calcular rango de duración de datos reales
  2. Hacer GET a /api/media con min_duration y max_duration
  3. Validar código de respuesta = 200
  4. Validar que resultados están dentro del rango
**Datos de prueba**: Rango de duración calculado de datos reales  
**Resultado esperado**: Respuesta 200 con medias en rango de duración.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-009  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por vistas mínimas basado en datos reales.  
**Precondiciones**: TC-001 ejecutado, estadísticas de vistas disponibles.  
**Pasos**:
  1. Obtener estadística de vistas de datos reales
  2. Hacer GET a /api/media con min_views
  3. Validar código de respuesta = 200
  4. Validar que resultados cumplen vistas mínimas
**Datos de prueba**: Valor mínimo de vistas de datos reales  
**Resultado esperado**: Respuesta 200 con medias que cumplen vistas mínimas.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-010  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por tipo de media usando datos reales.  
**Precondiciones**: TC-001 ejecutado, tipos de media disponibles.  
**Pasos**:
  1. Obtener tipo de media disponible de datos reales
  2. Hacer GET a /api/media con type={tipo}
  3. Validar código de respuesta = 200
  4. Validar que resultados son del tipo correcto
**Datos de prueba**: Tipo de media encontrado en datos reales  
**Resultado esperado**: Respuesta 200 con medias del tipo especificado.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-011  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por rango de fechas usando datos reales.  
**Precondiciones**: TC-001 ejecutado, información de fechas disponible.  
**Pasos**:
  1. Calcular rango de fechas de datos reales
  2. Hacer GET a /api/media con created_after y created_before
  3. Validar código de respuesta = 200
  4. Validar que resultados están en rango de fechas
**Datos de prueba**: Rango de fechas calculado de datos reales  
**Resultado esperado**: Respuesta 200 con medias en rango de fechas.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-012  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por fecha de creación posterior.  
**Precondiciones**: TC-001 ejecutado o datos de fecha disponibles.  
**Pasos**:
  1. Obtener fecha de referencia de datos reales
  2. Hacer GET a /api/media con created_after
  3. Validar código de respuesta = 200
  4. Validar que resultados son posteriores a fecha
**Datos de prueba**: Fecha de referencia de datos reales  
**Resultado esperado**: Respuesta 200 con medias creadas después de fecha.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-013  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar ordenamiento por fecha descendente.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con parámetros de ordenamiento descendente
  2. Validar código de respuesta = 200
  3. Validar que resultados están ordenados por fecha descendente
**Datos de prueba**: Parámetros de ordenamiento por fecha descendente  
**Resultado esperado**: Respuesta 200 con medias ordenadas descendente por fecha.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-014  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar navegación de paginación en segunda página.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con parámetros de segunda página
  2. Validar código de respuesta = 200
  3. Validar que cantidad respeta límite establecido
**Datos de prueba**: Parámetros de segunda página  
**Resultado esperado**: Respuesta 200 con elementos de segunda página.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-015  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar parámetro count para obtener total de elementos.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con count=true y limit=5
  2. Validar código de respuesta = 200
  3. Validar que respuesta incluye información de total
**Datos de prueba**: count=true, limit=5  
**Resultado esperado**: Respuesta 200 con información de total de elementos.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-016  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por tag usando datos reales.  
**Precondiciones**: TC-001 ejecutado, tags disponibles.  
**Pasos**:
  1. Obtener tag disponible de datos reales
  2. Hacer GET a /api/media con tag={tag} y tags-rule=in_any
  3. Validar código de respuesta = 200
  4. Validar que resultados contienen el tag
**Datos de prueba**: Tag encontrado en datos reales  
**Resultado esperado**: Respuesta 200 con medias que contienen el tag.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-017  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro without_category=true (solo medias sin categorías).  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con without_category=true
  2. Validar código de respuesta = 200
  3. Validar que solo retorna medias sin categorías
  4. Analizar estadísticas de categorías encontradas
**Datos de prueba**: without_category=true  
**Resultado esperado**: Respuesta 200 con solo medias sin categorías.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-018  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro without_category=false (incluye todas las medias).  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con without_category=false y limit=100
  2. Validar código de respuesta = 200
  3. Validar que incluye medias con y sin categorías
  4. Analizar distribución y estadísticas de categorías
**Datos de prueba**: without_category=false, limit=100  
**Resultado esperado**: Respuesta 200 con todas las medias (con y sin categorías).

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-019  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar filtro por estado de publicación.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con is_published=true
  2. Validar código de respuesta = 200
  3. Validar que solo retorna medias publicadas
  4. Analizar estados de inicialización detallados
**Datos de prueba**: is_published=true  
**Resultado esperado**: Respuesta 200 con solo medias publicadas.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-020  
**Módulo**: API – Media  
**Tipo de Prueba**: Contrato (Positiva)  
**Objetivo**: Validar campos específicos según estructura real de respuesta.  
**Precondiciones**: API activa y token válido.  
**Pasos**:
  1. Hacer GET a /api/media con limit=1
  2. Validar código de respuesta = 200
  3. Validar campos específicos (access_restrictions, access_rules, preview, etc.)
  4. Validar estructuras técnicas (protocols.hls, meta, thumbnails)
**Datos de prueba**: limit=1  
**Resultado esperado**: Respuesta 200 con estructura de campos específicos válida.

---

**ID del Caso de Prueba**: TC-API-G-MEDIA-021  
**Módulo**: API – Media  
**Tipo de Prueba**: Funcional (Positiva)  
**Objetivo**: Validar combinación de múltiples filtros usando datos reales.  
**Precondiciones**: TC-001 ejecutado, datos múltiples disponibles.  
**Pasos**:
  1. Obtener datos reales (ID, palabra, tipo)
  2. Hacer GET a /api/media combinando type, query, id simultáneamente
  3. Validar código de respuesta = 200
  4. Validar que filtros funcionan en conjunto
**Datos de prueba**: Combinación de filtros con datos reales  
**Resultado esperado**: Respuesta 200 con medias que cumplen todos los filtros.

---

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

