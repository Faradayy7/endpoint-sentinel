import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/api-client.js';
import { Logger } from '../utils/logger.js';

test.describe('🎫 Cupones API Tests - /api/coupon', () => {
  let logger;
  let extractedData = {
    randomGroupId: null,
    randomCode: null
  };

  test.beforeAll(async () => {
    logger = new Logger('cupones-tests');
    logger.info('🎫 Iniciando tests de API Cupones');
  });

  test.afterAll(async () => {
    logger.info('🎫 Tests de API Cupones completados');
    logger.info(`📊 Datos extraídos: Group ID: ${extractedData.randomGroupId}, Code: ${extractedData.randomCode}`);
  });

  test('TC-API-CUPONES-001: GET /api/coupon - Verificar respuesta básica', async ({ request }) => {
    const apiClient = new ApiClient(request);
    logger.info('🧪 Test: Verificar respuesta básica de cupones');
    
    const response = await apiClient.get('/api/coupon');
    
    expect(response.status()).toBe(200);
    const responseData = await apiClient.validateAndExtractJson(response);
    
    expect(responseData).toBeDefined();
    expect(responseData.status).toBe('OK');
    
    logger.info('✅ Respuesta básica verificada');
  });

  test('TC-API-CUPONES-002: GET /api/coupon - Verificar con parámetros', async ({ request }) => {
    const apiClient = new ApiClient(request);
    logger.info('🧪 Test: Verificar respuesta con parámetros');
    
    const response = await apiClient.get('/api/coupon', {
      params: { limit: 10 }
    });
    
    expect(response.status()).toBe(200);
    const responseData = await apiClient.validateAndExtractJson(response);
    
    expect(responseData).toBeDefined();
    expect(responseData.status).toBe('OK');
    
    logger.info('✅ Respuesta con parámetros verificada');
  });

  test('TC-API-CUPONES-003: GET /api/coupon - Extraer datos aleatorios', async ({ request }) => {
    const apiClient = new ApiClient(request);
    logger.info('🧪 Test: Extraer Group ID y Code aleatorios');
    
    const response = await apiClient.get('/api/coupon', {
      params: { limit: 50 }
    });
    
    expect(response.status()).toBe(200);
    const responseData = await apiClient.validateAndExtractJson(response);
    
    expect(responseData).toBeDefined();
    expect(responseData.status).toBe('OK');
    
    if (responseData.data && responseData.data.length > 0) {
      // Buscar cupones con group
      const couponsWithGroup = responseData.data.filter(coupon => coupon.group && coupon._id);
      if (couponsWithGroup.length > 0) {
        const randomGroupCoupon = couponsWithGroup[Math.floor(Math.random() * couponsWithGroup.length)];
        extractedData.randomGroupId = randomGroupCoupon._id;
        logger.info(`🎯 Group ID extraído: ${extractedData.randomGroupId}`);
      }
      
      // Buscar cupones con code
      const couponsWithCode = responseData.data.filter(coupon => coupon.code);
      if (couponsWithCode.length > 0) {
        const randomCodeCoupon = couponsWithCode[Math.floor(Math.random() * couponsWithCode.length)];
        extractedData.randomCode = randomCodeCoupon.code;
        logger.info(`🎯 Code extraído: ${extractedData.randomCode}`);
      }
    }
    
    logger.info('✅ Extracción de datos completada');
  });
});
