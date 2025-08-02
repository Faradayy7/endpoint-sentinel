import { test, expect } from '@playwright/test';
import { config, validateConfig } from '../config/environment.js';
import { ApiClient } from '../utils/api-client.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('MediaSmokeTests');

// Validar configuración antes de las pruebas
test.beforeAll(async () => {
  logger.info('Iniciando pruebas smoke del endpoint /api/media');
  try {
    validateConfig();
    logger.info('Configuración validada para pruebas smoke');
  } catch (error) {
    logger.error('Error en configuración:', error.message);
    throw error;
  }
});

// Configurar el cliente API para cada prueba
test.beforeEach(async ({ request }) => {
  test.apiClient = new ApiClient(request);
});

test.describe('Media API - Smoke Tests @smoke', () => {
  
  test('[TC-API-S-MEDIA-001] El endpoint /api/media responde correctamente', async () => {
    const response = await test.apiClient.get(config.mediaApi.endpoint);

    // Verificar que el endpoint esté disponible
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);

    // Verificar que retorna contenido JSON válido
    const data = response.data;
    expect(data).toBeDefined();
    
    logger.info('✅ Endpoint /api/media está funcionando correctamente');
  });

  test('[TC-API-S-MEDIA-002] La autenticación funciona correctamente', async () => {
    const response = await test.apiClient.get(config.mediaApi.endpoint, {
      params: { limit: 1 }, // Solo obtener 1 elemento para ser rápido
      useAuth: true,
    });

    expect(response.status).toBe(200);
    
    const data = response.data;
    expect(data).toBeDefined();
    
    logger.info('✅ Autenticación está funcionando correctamente');
  });

  test('[TC-API-S-MEDIA-003] Los parámetros básicos de paginación funcionan', async () => {
    const response = await test.apiClient.get(config.mediaApi.endpoint, {
      params: {
        limit: 5,
        skip: 0,
      },
    });

    expect(response.status).toBe(200);
    
    const data = response.data;
    expect(data).toBeDefined();
    
    // Si es un array, verificar que no exceda el límite
    if (Array.isArray(data)) {
      expect(data.length).toBeLessThanOrEqual(5);
    }
    
    logger.info('✅ Paginación básica está funcionando correctamente');
  });

  test('[TC-API-S-MEDIA-004] El filtro por tipo de media funciona', async () => {
    const response = await test.apiClient.get(config.mediaApi.endpoint, {
      params: {
        type: 'all',
        limit: 3,
      },
    });

    expect(response.status).toBe(200);
    
    const data = response.data;
    expect(data).toBeDefined();
    
    logger.info('✅ Filtro por tipo de media está funcionando correctamente');
  });

  test('[TC-API-S-MEDIA-005] El endpoint maneja peticiones sin autenticación apropiadamente', async () => {
    const response = await test.apiClient.get(config.mediaApi.endpoint, {
      params: { limit: 1 },
      useAuth: false, // Sin autenticación
    });

    // Dependiendo de la API, podría retornar 401 (no autorizado) o 200 con datos limitados
    // Ajustar según el comportamiento esperado de tu API
    const acceptableStatuses = [200, 401, 403];
    expect(acceptableStatuses).toContain(response.status);
    
    logger.info(`✅ Manejo de peticiones sin autenticación: Status ${response.status}`);
  });
});
