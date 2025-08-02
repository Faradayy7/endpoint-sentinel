#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Cargar variables del archivo .env
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para enviar notificaciones de Slack con resultados de tests
 */
class SlackNotifier {
  constructor() {
    this.reportPath = path.join(process.cwd(), 'playwright-report', 'index.html');
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
    this.repoName = process.env.GITHUB_REPOSITORY || 'Faradayy7/endpoint-sentinel';
    this.runId = process.env.GITHUB_RUN_ID;
    this.actor = process.env.GITHUB_ACTOR;
    this.ref = process.env.GITHUB_REF;
    this.pagesUrl = `https://${this.repoName.split('/')[0].toLowerCase()}.github.io/${this.repoName.split('/')[1]}`;
  }

  /**
   * Extrae estadísticas de tests del reporte HTML de Playwright
   */
  extractTestStats() {
    try {
      if (!fs.existsSync(this.reportPath)) {
        console.log('❌ No se encontró el reporte HTML');
        return { passed: 0, failed: 0, skipped: 0, total: 0 };
      }

      const htmlContent = fs.readFileSync(this.reportPath, 'utf8');
      
      // Múltiples patrones para extraer estadísticas
      let passed = 0, failed = 0, skipped = 0;

      // Patrón 1: <span class="passed">X</span>
      const passedMatch1 = htmlContent.match(/<span class="passed">(\d+)<\/span>/i);
      const failedMatch1 = htmlContent.match(/<span class="failed">(\d+)<\/span>/i);
      const skippedMatch1 = htmlContent.match(/<span class="skipped">(\d+)<\/span>/i);

      // Patrón 2: "passed":X
      const passedMatch2 = htmlContent.match(/"passed":(\d+)/i);
      const failedMatch2 = htmlContent.match(/"failed":(\d+)/i);
      const skippedMatch2 = htmlContent.match(/"skipped":(\d+)/i);

      // Patrón 3: passed X
      const passedMatch3 = htmlContent.match(/passed[^\d]*(\d+)/i);
      const failedMatch3 = htmlContent.match(/failed[^\d]*(\d+)/i);
      const skippedMatch3 = htmlContent.match(/skipped[^\d]*(\d+)/i);

      // Usar el primer patrón que funcione
      passed = passedMatch1?.[1] || passedMatch2?.[1] || passedMatch3?.[1] || 0;
      failed = failedMatch1?.[1] || failedMatch2?.[1] || failedMatch3?.[1] || 0;
      skipped = skippedMatch1?.[1] || skippedMatch2?.[1] || skippedMatch3?.[1] || 0;

      passed = parseInt(passed, 10);
      failed = parseInt(failed, 10);
      skipped = parseInt(skipped, 10);
      
      const total = passed + failed + skipped;

      console.log(`📊 Estadísticas extraídas: Total=${total}, Passed=${passed}, Failed=${failed}, Skipped=${skipped}`);
      
      return { passed, failed, skipped, total };
    } catch (error) {
      console.error('❌ Error extrayendo estadísticas:', error.message);
      return { passed: 0, failed: 0, skipped: 0, total: 0 };
    }
  }

  /**
   * Genera el payload para Slack
   */
  generateSlackPayload(stats) {
    const isSuccess = stats.failed === 0 && stats.total > 0;
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    
    const statusEmoji = isSuccess ? '✅' : '❌';
    const statusText = isSuccess ? 'TODOS LOS TESTS PASARON' : 'ALGUNOS TESTS FALLARON';
    const color = isSuccess ? 'good' : 'danger';
    
    // Determinar el branch desde GITHUB_REF
    const branch = this.ref ? this.ref.replace('refs/heads/', '') : 'main';

    // Mensaje más simple y compatible
    const message = `${statusEmoji} *Endpoint Sentinel - Test Results*\n\n` +
      `*Estado:* ${statusText}\n` +
      `*Fecha:* ${timestamp}\n` +
      `*Branch:* ${branch}\n` +
      `*Actor:* ${this.actor || 'Unknown'}\n\n` +
      `*📊 Resultados:*\n` +
      `✅ Passed: ${stats.passed}\n` +
      `❌ Failed: ${stats.failed}\n` +
      `⏭️ Skipped: ${stats.skipped}\n` +
      `📈 Total: ${stats.total}\n\n` +
      `*🎯 Endpoint:* \`/api/coupon\`\n` +
      `*📋 Suite:* Cupones API Tests\n\n` +
      `� <${this.pagesUrl}|Ver Reporte HTML> | <https://github.com/${this.repoName}/actions/runs/${this.runId || ''}|Ver Workflow>`;

    return {
      text: `${statusEmoji} Endpoint Sentinel - Resultados de Tests`,
      attachments: [
        {
          color: color,
          text: message,
          mrkdwn_in: ["text"]
        }
      ]
    };
  }

  /**
   * Envía la notificación a Slack
   */
  async sendSlackNotification(payload) {
    if (!this.webhookUrl) {
      console.log('⚠️ SLACK_WEBHOOK_URL no está configurada, saltando notificación');
      return;
    }

    console.log(`🔗 Enviando a: ${this.webhookUrl.substring(0, 50)}...`);

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(payload);
      
      console.log(`📦 Tamaño del payload: ${Buffer.byteLength(postData)} bytes`);
      
      const url = new URL(this.webhookUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 10000 // 10 segundos de timeout
      };

      console.log(`🌐 Conectando a: ${options.hostname}:${options.port}`);

      const req = https.request(options, (res) => {
        let data = '';
        
        console.log(`📡 Respuesta HTTP: ${res.statusCode}`);
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Notificación de Slack enviada exitosamente');
            console.log(`📥 Respuesta: ${data}`);
            resolve(data);
          } else {
            console.error(`❌ Error enviando notificación: ${res.statusCode} - ${data}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Error en la petición a Slack:', error.message);
        console.error('🔍 Detalles del error:', error);
        reject(error);
      });

      req.on('timeout', () => {
        console.error('⏰ Timeout en la petición a Slack');
        req.destroy();
        reject(new Error('Timeout en la petición'));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Método principal
   */
  async run() {
    try {
      console.log('🚀 Iniciando notificador de Slack...');
      console.log(`📂 Buscando reporte en: ${this.reportPath}`);
      console.log(`🌐 URL de Pages: ${this.pagesUrl}`);
      
      // Extraer estadísticas
      const stats = this.extractTestStats();
      
      // Generar payload
      const payload = this.generateSlackPayload(stats);
      
      // Mostrar payload para debug (sin webhook URL)
      console.log('📤 Payload generado:', JSON.stringify({
        ...payload,
        webhook_url: this.webhookUrl ? '[CONFIGURADA]' : '[NO CONFIGURADA]'
      }, null, 2));
      
      // Enviar notificación
      await this.sendSlackNotification(payload);
      
      console.log('🎉 Proceso completado exitosamente');
      
    } catch (error) {
      console.error('💥 Error en el proceso:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar si es llamado directamente
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  const notifier = new SlackNotifier();
  notifier.run();
}

export default SlackNotifier;
