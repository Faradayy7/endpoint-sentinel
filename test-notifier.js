#!/usr/bin/env node

import IntelligentSlackNotifier from './scripts/intelligent-notifier.js';

async function testNotifier() {
  console.log('🧪 Probando el notificador inteligente...\n');
  
  const notifier = new IntelligentSlackNotifier();
  
  // Simular variables de entorno para la prueba
  notifier.actor = 'QA-Tester';
  notifier.repoName = 'Faradayy7/endpoint-sentinel';
  notifier.runId = '12345';
  
  try {
    // Leer resultados de tests reales
    const fs = await import('fs');
    let testResults = null;
    
    if (fs.existsSync(notifier.testResultsPath)) {
      const resultsContent = fs.readFileSync(notifier.testResultsPath, 'utf8');
      testResults = JSON.parse(resultsContent);
      console.log('📊 Resultados cargados desde test-results.json');
    } else {
      console.log('⚠️ No se encontró test-results.json, usando datos de ejemplo');
      // Datos de ejemplo basados en la ejecución anterior
      testResults = {
        suites: [{
          title: 'cupones.spec.js',
          file: 'tests/api/cupones.spec.js'
        }]
      };
    }

    // Calcular estadísticas
    const stats = notifier.calculateStats(testResults);
    console.log('📈 Estadísticas:', stats);
    
    // Generar mensaje
    const message = notifier.generateMessage(stats);
    
    console.log('\n🎯 MENSAJE GENERADO:');
    console.log('━'.repeat(50));
    console.log(message);
    console.log('━'.repeat(50));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testNotifier();
