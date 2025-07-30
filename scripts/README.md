# Slack Notifier Script

Este script envía notificaciones a Slack con los resultados de los tests de Playwright.

## Características

- ✅ Extrae estadísticas de tests del reporte HTML de Playwright
- 📊 Muestra: Passed, Failed, Skipped y Total de tests
- 🔗 Incluye enlaces al reporte HTML y al workflow de GitHub
- 🎨 Formato profesional con bloques de Slack
- 🛡️ Manejo de errores robusto

## Uso

### En GitHub Actions
El script se ejecuta automáticamente en el workflow:

```yaml
- name: 💬 Send Slack notification (via script)
  if: always()
  run: node scripts/slack-notifier.js
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Prueba local
Para probar localmente:

```bash
# Asegúrate de tener un reporte de Playwright generado
npx playwright test --reporter=html

# Configura la webhook URL (opcional para testing)
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Ejecuta el script
node scripts/slack-notifier.js
```

## Variables de entorno

- `SLACK_WEBHOOK_URL`: URL del webhook de Slack (requerida para enviar notificaciones)
- `GITHUB_REPOSITORY`: Repositorio (auto-configurado en GitHub Actions)
- `GITHUB_RUN_ID`: ID del run (auto-configurado en GitHub Actions)
- `GITHUB_ACTOR`: Usuario que ejecutó el workflow (auto-configurado)
- `GITHUB_REF`: Referencia del branch (auto-configurado)

## Configuración de Slack

1. Ve a tu workspace de Slack
2. Crea una nueva app o usa una existente
3. Habilita "Incoming Webhooks"
4. Crea un nuevo webhook para el canal deseado
5. Copia la URL del webhook
6. Agrégala como secreto `SLACK_WEBHOOK_URL` en tu repositorio

## Salida de ejemplo

El script mostrará algo como:

```
🚀 Iniciando notificador de Slack...
📂 Buscando reporte en: /path/to/playwright-report/index.html
🌐 URL de Pages: https://username.github.io/repository-name
📊 Estadísticas extraídas: Total=21, Passed=19, Failed=2, Skipped=0
📤 Payload generado: {...}
✅ Notificación de Slack enviada exitosamente
🎉 Proceso completado exitosamente
```
