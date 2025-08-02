# 📢 Sistema de Notificaciones Slack para QA Automation

Este proyecto incluye un sistema avanzado de notificaciones Slack que envía automáticamente los resultados de las ejecuciones de tests.

## 🎯 Características

### ✅ Notificaciones Automáticas
- **Detección inteligente** del tipo de tests ejecutados
- **Estadísticas precisas** de passed/failed/skipped
- **Mensajes contextuales** específicos para cada API
- **Información detallada** sobre endpoints y funcionalidades validadas

### 🔧 Dos Versiones Disponibles

1. **`slack-notifier.js`** - Notificador básico con estadísticas fijas
2. **`intelligent-notifier.js`** - Notificador inteligente con detección automática

## 🚀 Configuración

### 1. Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
# Webhook URL de Slack (obligatorio)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Variables opcionales para GitHub Actions
GITHUB_REPOSITORY=tu-usuario/tu-repo
GITHUB_RUN_ID=12345
GITHUB_ACTOR=tu-usuario
GITHUB_REF=refs/heads/main
```

### 2. Crear Webhook en Slack

1. Ve a tu workspace de Slack
2. Crea una nueva **Incoming Webhook App**
3. Selecciona el canal donde quieres recibir notificaciones
4. Copia la URL del webhook y agrégala al archivo `.env`

## 📋 Uso

### Ejecución Manual
```bash
# Notificador básico
node scripts/slack-notifier.js

# Notificador inteligente
node scripts/intelligent-notifier.js
```

### Integración con Tests
```bash
# Ejecutar tests y enviar notificación
npx playwright test tests/api/cupones.spec.js --reporter=html && node scripts/intelligent-notifier.js
```

### Integración con GitHub Actions
```yaml
name: QA Tests with Slack Notifications

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Run API tests
        run: npx playwright test tests/api/ --reporter=html
        
      - name: Send Slack notification
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: node scripts/intelligent-notifier.js
```

## 🎯 Tipos de Tests Detectados

### 🎫 Cupones API (`/api/coupon`)
- **Operaciones:** GET, POST, PUT, DELETE
- **Funcionalidades:** Cupones reutilizables/no-reutilizables, validaciones, códigos personalizados
- **Tests:** 22 casos de prueba completos

### 📺 Media API (`/api/media`)
- **Operaciones:** GET, POST, DELETE
- **Funcionalidades:** Subida de archivos, gestión multimedia, validaciones de formato
- **Tests:** Smoke tests y funcionalidad completa

### 🔐 Auth API (`/api/auth`)
- **Operaciones:** POST, GET
- **Funcionalidades:** Autenticación, tokens, validaciones de usuario

### 👤 User API (`/api/user`)
- **Operaciones:** GET, POST, PUT
- **Funcionalidades:** Gestión de usuarios, perfiles, configuraciones

## 📊 Formato de Notificaciones

### ✅ Ejemplo de Notificación Exitosa
```
✅ Endpoint Sentinel - Resultados de Tests

Estado: TODOS LOS TESTS PASARON
Fecha: 2025-08-02 02:45:17 UTC
Branch: main
Actor: Automatizado

📊 Resultados de Ejecución:
✅ Pasaron: 22
❌ Fallaron: 0
⏭️ Saltados: 0
📈 Total ejecutados: 22

🎯 Suite Principal: Cupones API (90.0% detectado)
📈 Tasa de Éxito: 100.0%

🎫 Endpoint: /api/coupon - CRUD completo para cupones
📋 Operaciones: GET, POST, PUT, DELETE validadas
✨ Funcionalidades: Cupones reutilizables/no-reutilizables, validaciones, códigos personalizados
```

### ❌ Ejemplo de Notificación con Fallos
```
❌ Endpoint Sentinel - Resultados de Tests

Estado: 2 TESTS FALLARON
Fecha: 2025-08-02 02:45:17 UTC
Branch: main
Actor: Automatizado

📊 Resultados de Ejecución:
✅ Pasaron: 20
❌ Fallaron: 2
⏭️ Saltados: 0
📈 Total ejecutados: 22

🎯 Suite Principal: Cupones API (90.0% detectado)
📈 Tasa de Éxito: 90.9%

🎫 Endpoint: /api/coupon - CRUD completo para cupones
📋 Operaciones: GET, POST, PUT, DELETE validadas
✨ Funcionalidades: Cupones reutilizables/no-reutilizables, validaciones, códigos personalizados
```

## 🔍 Detección Inteligente

El notificador inteligente utiliza múltiples fuentes para detectar automáticamente qué tests se ejecutaron:

1. **Archivos de test** - Analiza nombres de archivos `.spec.js`
2. **Argumentos CLI** - Lee parámetros pasados al script
3. **Contenido HTML** - Examina el reporte generado por Playwright
4. **Patrones de keywords** - Busca palabras clave específicas de cada API

### Niveles de Confianza
- **90%** - Detección por nombre de archivo
- **80%** - Detección por argumento CLI
- **70%** - Detección por contenido HTML

## 🛠️ Personalización

### Agregar Nuevo Tipo de Test
Para agregar soporte para un nuevo tipo de API, edita `intelligent-notifier.js`:

```javascript
const testSuites = {
  // ... suites existentes
  
  nuevaapi: {
    name: 'Nueva API',
    endpoint: '/api/nueva',
    keywords: ['nueva', 'new', '🆕'],
    operations: ['GET', 'POST'],
    features: ['Funcionalidad A', 'Funcionalidad B']
  }
};
```

### Modificar Formato de Mensaje
Edita la función `generateDynamicPayload()` para personalizar el formato:

```javascript
// Agregar nueva condición para tu API
if (stats.primarySuite.includes('Nueva')) {
  endpointInfo = '*🆕 Endpoint:* `/api/nueva` - Nueva funcionalidad';
  suiteDescription = '*📋 Operaciones:* GET, POST validadas\n*✨ Funcionalidades:* Funcionalidad A, Funcionalidad B';
}
```

## 🚨 Troubleshooting

### Problema: No se envían notificaciones
- ✅ Verificar que `SLACK_WEBHOOK_URL` esté configurada
- ✅ Comprobar que la URL del webhook sea válida
- ✅ Revisar permisos del workspace de Slack

### Problema: Estadísticas incorrectas
- ✅ Verificar que exista el archivo `playwright-report/index.html`
- ✅ Ejecutar tests con `--reporter=html`
- ✅ Comprobar que los patrones de detección coincidan con tu contenido

### Problema: Detección incorrecta de suite
- ✅ Agregar keywords específicas para tu tipo de test
- ✅ Verificar que los nombres de archivos sean descriptivos
- ✅ Revisar los patrones en `analyzeTestExecution()`

## 📈 Métricas y Análisis

El sistema proporciona:
- **Tasa de éxito** calculada automáticamente
- **Detección de confianza** para validar la precisión
- **Información contextual** específica por tipo de API
- **Enlaces directos** al reporte detallado y workflow de GitHub

## 🔄 Roadmap

- [ ] Integración con bases de datos para histórico
- [ ] Notificaciones por email
- [ ] Dashboard web para métricas
- [ ] Alertas por umbrales de fallo
- [ ] Integración con Jira para creación automática de bugs

---

**Desarrollado para Endpoint Sentinel QA Automation System**  
*Sistema de notificaciones inteligentes para equipos de QA*
