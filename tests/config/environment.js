import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración centralizada del proyecto
 * Aquí se definen todas las configuraciones que usarán las pruebas
 */
export const config = {
  // Configuración de la API
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
    token: process.env.API_TOKEN || '',
    timeout: parseInt(process.env.TEST_TIMEOUT) || 30000,
    retries: parseInt(process.env.TEST_RETRIES) || 2,
  },

  // Configuración específica del endpoint de media
  mediaApi: {
    endpoint: process.env.MEDIA_ENDPOINT || '/api/media',
    defaultLimit: parseInt(process.env.DEFAULT_LIMIT) || 100,
    defaultSkip: parseInt(process.env.DEFAULT_SKIP) || 0,
  },

  // Datos de prueba
  testData: {
    mediaId: process.env.TEST_MEDIA_ID || '',
    categoryId: process.env.TEST_CATEGORY_ID || '',
    jobId: process.env.TEST_JOB_ID || '',
  },

  // Configuración de autenticación
  auth: {
    tokenHeader: process.env.X_API_TOKEN_HEADER || 'X-API-Token',
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableDebug: process.env.ENABLE_DEBUG_LOGS === 'true',
  },
};

/**
 * Valida que las configuraciones requeridas estén presentes
 */
export function validateConfig() {
  const requiredFields = [
    { key: 'API_BASE_URL', value: config.api.baseUrl },
    { key: 'API_TOKEN', value: config.api.token },
  ];

  const missingFields = requiredFields.filter((field) => !field.value);

  if (missingFields.length > 0) {
    throw new Error(
      `Faltan configuraciones requeridas: ${missingFields.map((f) => f.key).join(', ')}.\n` +
        'Por favor, copia .env.example a .env y completa los valores.'
    );
  }
}
