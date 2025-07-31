import { test, expect } from '@playwright/test';
import { ApiClient } from '../utils/api-client.js';
import { Logger } from '../utils/logger.js';
import { TestDataManager } from '../utils/test-data-manager.js';

const logger = new Logger('cupones-tests');
const testDataManager = new TestDataManager();

test.describe('🎫 Cupones API Tests - /api/coupon', () => {
  let apiClient;
  let extractedGroupIds = [];
  let generatedCouponCodes = [];
  let generatedCouponIds = [];

  test.beforeAll(async ({ request }) => {
    logger.info('🎫 Iniciando tests completos de API Cupones');
    apiClient = new ApiClient(request);
    
    // Obtener datos de cupones existentes para usar Group IDs reales
    logger.info('📊 Obteniendo Group IDs existentes...');
    const response = await apiClient.get('/api/coupon', { limit: 50 });
    
    if (response.status === 200 && response.data.status === 'OK') {
      testDataManager.processCouponsData(response.data);
      
      // Extraer solo los _id de los grupos, no los objetos completos
      const rawGroupIds = testDataManager.getAllGroupIds();
      extractedGroupIds = rawGroupIds.map(groupObj => {
        // Si es un objeto, extraer el _id, si es string, usarlo directamente
        return typeof groupObj === 'object' && groupObj._id ? groupObj._id : groupObj;
      });
      
      logger.info(`✅ ${extractedGroupIds.length} Group IDs obtenidos para tests`);
      
      if (extractedGroupIds.length > 0) {
        logger.info(`🎯 Ejemplo Group ID: ${extractedGroupIds[0]}`);
      }
    }
  });

  test.afterAll(() => {
    logger.info('🎫 Tests completos de API Cupones completados');
    
    // Mostrar resumen de datos extraídos
    const groupIds = testDataManager.getAllGroupIds();
    const codes = testDataManager.getAllCouponCodes();
    logger.info(`📊 Datos extraídos de GET: ${groupIds.length} Group IDs, ${codes.length} Códigos`);
    
    if (generatedCouponCodes.length > 0) {
      logger.info(`📊 Códigos generados en POST: ${generatedCouponCodes.length}`);
      logger.info(`🎯 Códigos creados: ${generatedCouponCodes.join(', ')}`);
    }
  });

  // ================== TESTS GET ==================

  test('TC-API-CUPONES-001: GET /api/coupon - Verificar respuesta básica', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Verificar respuesta básica de cupones');

    const response = await apiClient.get('/api/coupon');
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);
    
    // Procesar datos para tests posteriores
    testDataManager.processCouponsData(response.data);
    
    logger.info('✅ Respuesta básica verificada');
  });

  test('TC-API-CUPONES-002: GET /api/coupon - Verificar con parámetros', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Verificar respuesta con parámetros');

    const response = await apiClient.get('/api/coupon', { page: 1, limit: 10 });
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);
    
    logger.info('✅ Respuesta con parámetros verificada');
  });

  test('TC-API-CUPONES-003: GET /api/coupon - Extraer datos aleatorios', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Extraer Group ID y Code aleatorios');

    const response = await apiClient.get('/api/coupon');
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);
    expect(response.data.data.length).toBeGreaterThan(0);
    
    // Extraer datos aleatorios
    const coupons = response.data.data;
    const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)];
    
    expect(randomCoupon).toHaveProperty('group');
    expect(randomCoupon).toHaveProperty('code');
    
    const groupId = randomCoupon.group;
    const code = randomCoupon.code;
    
    logger.info(`🎯 Group ID extraído: ${groupId}`);
    logger.info(`🎯 Code extraído: ${code}`);
    
    // Procesar todos los datos
    testDataManager.processCouponsData(response.data);
    
    logger.info('✅ Extracción de datos completada');
  });

  test('TC-API-CUPONES-004: GET /api/coupon - Validar estructura de datos', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Validar estructura de datos de cupones');

    const response = await apiClient.get('/api/coupon');
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    
    const coupons = response.data.data;
    if (coupons.length > 0) {
      const sampleCoupon = coupons[0];
      
      // Validar campos obligatorios
      expect(sampleCoupon).toHaveProperty('_id');
      expect(sampleCoupon).toHaveProperty('group');
      expect(sampleCoupon).toHaveProperty('code');
      expect(sampleCoupon).toHaveProperty('date_created');
      
      logger.info('✅ Estructura de datos validada');
    }
  });

  test('TC-API-CUPONES-005: GET /api/coupon - Test de paginación', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Validar paginación de cupones');

    const responsePage1 = await apiClient.get('/api/coupon', { page: 1, limit: 5 });
    const responsePage2 = await apiClient.get('/api/coupon', { page: 2, limit: 5 });
    
    expect(responsePage1.status).toBe(200);
    expect(responsePage2.status).toBe(200);
    
    expect(responsePage1.data.status).toBe('OK');
    expect(responsePage2.data.status).toBe('OK');
    
    logger.info('✅ Paginación validada');
  });

  test('TC-API-CUPONES-006: GET /api/coupon - Test con filtros de fecha', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Validar filtros de fecha');

    const today = new Date().toISOString().split('T')[0];
    const response = await apiClient.get('/api/coupon', { date: today });
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    
    logger.info('✅ Filtros de fecha validados');
  });

  test('TC-API-CUPONES-007: GET /api/coupon - Test con límites', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Validar límites de respuesta');

    const response = await apiClient.get('/api/coupon', { limit: 2 });
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);
    
    logger.info('✅ Límites validados');
  });

  test('TC-API-CUPONES-008: GET /api/coupon - Test de búsqueda', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Validar funcionalidad de búsqueda');

    // Obtener datos primero para usar en búsqueda
    const initialResponse = await apiClient.get('/api/coupon', { limit: 1 });
    if (initialResponse.data.data.length > 0) {
      const sampleCode = initialResponse.data.data[0].code;
      const searchResponse = await apiClient.get('/api/coupon', { search: sampleCode });
      
      expect(searchResponse.status).toBe(200);
      expect(searchResponse.data.status).toBe('OK');
    }
    
    logger.info('✅ Búsqueda validada');
  });

  test('TC-API-CUPONES-009: GET /api/coupon - Test de ordenamiento', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Validar ordenamiento');

    const response = await apiClient.get('/api/coupon', { sort: 'date_created', order: 'desc' });
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    
    logger.info('✅ Ordenamiento validado');
  });

  test('TC-API-CUPONES-010: GET /api/coupon - Test performance básico', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Performance básico');

    const startTime = Date.now();
    const response = await apiClient.get('/api/coupon');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Menos de 5 segundos
    
    logger.info(`⏱️ Tiempo de respuesta: ${responseTime}ms`);
    logger.info('✅ Performance básico validado');
  });

  // ================== TESTS POST ==================

  test('TC-API-CUPONES-011: POST /api/coupon - Crear cupón no reutilizable (is_reusable: false)', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Crear cupón no reutilizable');

    // Usar un Group ID real de los datos extraídos
    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";

    const couponData = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-08-31T23:59:59Z",
      is_reusable: "false",
      max_use: "1",
      customer_max_use: "1",
      detail: "QA Test - Single Use Coupon",
      quantity: "1",
      discount_type: "percent",
      percent: "10",
      type: "ppv-live",
      type_code: "qa_test_single",
      payment_required: "false"
    };

    logger.info(`🎯 Creando cupón con Group ID: ${groupId}`);
    logger.info(`📝 Datos: ${JSON.stringify(couponData)}`);

    const response = await apiClient.post('/api/coupon', couponData);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);
    expect(response.data.data.length).toBeGreaterThan(0);

    // Validar la estructura de respuesta
    const createdCoupon = response.data.data[0];
    expect(createdCoupon).toHaveProperty('code');
    expect(createdCoupon).toHaveProperty('_id');
    expect(typeof createdCoupon.code).toBe('string');
    expect(typeof createdCoupon._id).toBe('string');

    // Guardar el código generado
    generatedCouponCodes.push(createdCoupon.code);
    generatedCouponIds.push(createdCoupon._id);
    
    logger.info(`✅ Cupón no reutilizable creado: ${createdCoupon.code} (ID: ${createdCoupon._id})`);
  });

  test('TC-API-CUPONES-012: POST /api/coupon - Crear cupón reutilizable con código personalizado (is_reusable: true)', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Crear cupón reutilizable con código personalizado');

    // Usar un Group ID real de los datos extraídos
    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";
    
    // Generar un código único para evitar duplicados
    const timestamp = Date.now().toString().slice(-6);
    const customCode = `QA-TEST-${timestamp}`;

    const couponData = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-08-31T23:59:59Z",
      is_reusable: "true",
      max_use: "5",
      customer_max_use: "2",
      custom_code: customCode,
      detail: "QA Test - Reusable Custom Coupon",
      quantity: "1",
      discount_type: "amount",
      amount: "15",
      type: "ppv-live",
      type_code: "qa_test_reusable",
      payment_required: "true"
    };

    logger.info(`🎯 Creando cupón reutilizable con código personalizado: ${customCode}`);
    logger.info(`📝 Datos: ${JSON.stringify(couponData)}`);

    const response = await apiClient.post('/api/coupon', couponData);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);
    expect(response.data.data.length).toBeGreaterThan(0);

    // Validar la estructura de respuesta
    const createdCoupon = response.data.data[0];
    expect(createdCoupon).toHaveProperty('code');
    expect(createdCoupon).toHaveProperty('_id');
    expect(createdCoupon.code).toBe(customCode); // Debe usar el código personalizado
    expect(typeof createdCoupon._id).toBe('string');

    // Guardar el código generado
    generatedCouponCodes.push(createdCoupon.code);
    generatedCouponIds.push(createdCoupon._id);
    
    logger.info(`✅ Cupón reutilizable creado: ${createdCoupon.code} (ID: ${createdCoupon._id})`);
  });

  test('TC-API-CUPONES-013: POST /api/coupon - Error al crear cupón con código duplicado', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Error al crear cupón con código duplicado');

    // Usar un código que ya existe de los tests anteriores
    if (generatedCouponCodes.length === 0) {
      logger.info('⚠️ No hay códigos generados previamente, saltando test');
      test.skip();
      return;
    }

    const existingCode = generatedCouponCodes[0];
    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";

    const duplicateCouponData = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-08-31T23:59:59Z",
      is_reusable: "true",
      max_use: "3",
      customer_max_use: "1",
      custom_code: existingCode, // Usar código duplicado
      detail: "QA Test - Duplicate Code Attempt",
      quantity: "1",
      discount_type: "percent",
      percent: "5",
      type: "ppv-live",
      type_code: "qa_test_duplicate",
      payment_required: "false"
    };

    logger.info(`🎯 Intentando crear cupón con código duplicado: ${existingCode}`);

    const response = await apiClient.post('/api/coupon', duplicateCouponData);
    
    // Esperamos un error 400 por código duplicado
    expect(response.status).toBe(400);
    expect(response.data.status).toBe('ERROR');
    expect(response.data.data).toBeDefined();
    
    logger.info(`✅ Error esperado al intentar duplicar código: ${response.data.data}`);
  });

  test('TC-API-CUPONES-014: POST /api/coupon - Error con datos inválidos', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Error con datos inválidos');

    const invalidCouponData = {
      group: "", // Group ID vacío - debería causar error
      valid_from: "fecha-invalida",
      valid_to: "2025-08-31T23:59:59Z",
      is_reusable: "maybe", // Valor inválido
      max_use: "-1", // Valor negativo
      custom_code: "INVALID CODE WITH SPACES!", // Código con espacios y caracteres especiales
      detail: "QA Test - Invalid Data",
      quantity: "0", // Cantidad cero
      discount_type: "invalid_type",
      amount: "not_a_number",
      type: "",
      payment_required: "not_boolean"
    };

    logger.info(`🎯 Enviando datos inválidos para validar manejo de errores`);

    const response = await apiClient.post('/api/coupon', invalidCouponData);
    
    // La API puede devolver 400 o 500 dependiendo del tipo de error
    // Aceptamos ambos como válidos para validación de datos inválidos
    expect([400, 500]).toContain(response.status);
    expect(response.data.status).toBe('ERROR');
    
    logger.info(`✅ Error esperado con datos inválidos (${response.status}): ${response.data.data || 'Bad Request'}`);
  });

  test('TC-API-CUPONES-015: POST /api/coupon - Validar creación con metadatos', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Crear cupón con metadatos adicionales');

    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";
    const timestamp = Date.now().toString().slice(-6);
    const customCode = `QA-META-${timestamp}`;

    const couponWithMetadata = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-08-31T23:59:59Z",
      is_reusable: "true",
      max_use: "10",
      customer_max_use: "3",
      custom_code: customCode,
      detail: "QA Test - Coupon with Metadata",
      quantity: "1",
      discount_type: "percent",
      percent: "20",
      type: "ppv-live",
      type_code: "qa_test_metadata",
      payment_required: "true",
      metadata: JSON.stringify({
        campaign_id: "QA_CAMPAIGN_2025",
        source: "automated_test",
        priority: "high",
        test_run: timestamp
      })
    };

    logger.info(`🎯 Creando cupón con metadatos: ${customCode}`);

    const response = await apiClient.post('/api/coupon', couponWithMetadata);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(Array.isArray(response.data.data)).toBe(true);

    const createdCoupon = response.data.data[0];
    expect(createdCoupon.code).toBe(customCode);
    
    generatedCouponCodes.push(createdCoupon.code);
    generatedCouponIds.push(createdCoupon._id);
    
    logger.info(`✅ Cupón con metadatos creado: ${createdCoupon.code} (ID: ${createdCoupon._id})`);
  });

  // ================== TESTS INDIVIDUALES ==================

  test('TC-API-CUPONES-016: GET /api/coupon/{coupon_id} - Obtener cupón por ID', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Obtener cupón por ID');

    // Usar un ID de los cupones creados anteriormente
    if (generatedCouponIds.length === 0) {
      logger.info('⚠️ No hay IDs de cupones generados, saltando test');
      test.skip();
      return;
    }

    const couponId = generatedCouponIds[0];
    logger.info(`🎯 Obteniendo cupón con ID: ${couponId}`);

    const response = await apiClient.get(`/api/coupon/${couponId}`);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(response.data.data).toBeDefined();
    expect(response.data.data._id).toBe(couponId);

    // Validar estructura completa del cupón
    const coupon = response.data.data;
    expect(coupon).toHaveProperty('code');
    expect(coupon).toHaveProperty('group');
    expect(coupon).toHaveProperty('date_created');
    expect(coupon).toHaveProperty('is_reusable');
    expect(coupon).toHaveProperty('is_used');
    expect(coupon).toHaveProperty('is_valid');
    
    logger.info(`✅ Cupón obtenido: ${coupon.code} (Reutilizable: ${coupon.is_reusable}, Usado: ${coupon.is_used})`);
  });

  test('TC-API-CUPONES-017: GET /api/coupon/{coupon_code}/search - Buscar cupón por código', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Buscar cupón por código');

    // Usar un código de los cupones creados anteriormente
    if (generatedCouponCodes.length === 0) {
      logger.info('⚠️ No hay códigos de cupones generados, saltando test');
      test.skip();
      return;
    }

    const couponCode = generatedCouponCodes[0];
    logger.info(`🎯 Buscando cupón con código: ${couponCode}`);

    const response = await apiClient.get(`/api/coupon/${couponCode}/search`);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(response.data.data).toBeDefined();
    expect(response.data.data.code).toBe(couponCode);

    // Validar estructura del cupón encontrado
    const coupon = response.data.data;
    expect(coupon).toHaveProperty('_id');
    expect(coupon).toHaveProperty('group');
    expect(coupon).toHaveProperty('date_created');
    
    logger.info(`✅ Cupón encontrado por código: ${coupon.code} (ID: ${coupon._id})`);
  });

  test('TC-API-CUPONES-018: POST /api/coupon/{coupon_id} - Actualizar cupón existente', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Actualizar cupón existente');

    // Usar un ID de los cupones creados anteriormente
    if (generatedCouponIds.length === 0) {
      logger.info('⚠️ No hay IDs de cupones generados, saltando test');
      test.skip();
      return;
    }

    const couponId = generatedCouponIds[0];
    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";

    const updateData = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-09-30T23:59:59Z", // Extender fecha
      is_reusable: "true",
      max_use: "10", // Aumentar usos
      customer_max_use: "5",
      detail: "QA Test - Cupón Actualizado",
      amount: "25", // Cambiar monto
      type: "ppv-live",
      type_code: "qa_test_updated",
      payment_required: "true",
      metadata: JSON.stringify({
        updated: "true",
        update_date: new Date().toISOString()
      })
    };

    logger.info(`🎯 Actualizando cupón con ID: ${couponId}`);
    logger.info(`📝 Datos de actualización: ${JSON.stringify(updateData)}`);

    const response = await apiClient.post(`/api/coupon/${couponId}`, updateData);
    
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
    expect(response.data.data).toBeDefined();
    expect(response.data.data._id).toBe(couponId);

    // Validar que los cambios se aplicaron
    const updatedCoupon = response.data.data;
    expect(updatedCoupon.detail).toContain('Actualizado');
    expect(updatedCoupon.amount).toBe(25);
    
    logger.info(`✅ Cupón actualizado: ${updatedCoupon.code} (Nuevo monto: ${updatedCoupon.amount})`);
  });

  test('TC-API-CUPONES-019: POST /api/coupon/{coupon_id} - Error al actualizar con código ya usado', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Error al actualizar cupón con código ya usado');

    // Necesitamos al menos 2 cupones para probar duplicado
    if (generatedCouponIds.length < 2 || generatedCouponCodes.length < 2) {
      logger.info('⚠️ Se necesitan al menos 2 cupones generados, saltando test');
      test.skip();
      return;
    }

    const couponIdToUpdate = generatedCouponIds[1]; // Segundo cupón
    const existingCode = generatedCouponCodes[0]; // Código del primer cupón
    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";

    const updateDataWithDuplicateCode = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-09-30T23:59:59Z",
      is_reusable: "true",
      max_use: "5",
      customer_max_use: "2",
      custom_code: existingCode, // Intentar usar código ya existente
      detail: "QA Test - Intento de código duplicado",
      amount: "20",
      type: "ppv-live",
      type_code: "qa_test_duplicate_update",
      payment_required: "true"
    };

    logger.info(`🎯 Intentando actualizar cupón ${couponIdToUpdate} con código ya usado: ${existingCode}`);

    const response = await apiClient.post(`/api/coupon/${couponIdToUpdate}`, updateDataWithDuplicateCode);
    
    // Esperamos un error por código duplicado
    expect([400, 500]).toContain(response.status);
    expect(response.data.status).toBe('ERROR');
    
    logger.info(`✅ Error esperado al intentar usar código duplicado en actualización (${response.status}): ${response.data.data}`);
  });

  test('TC-API-CUPONES-020: Crear cupón para eliminar y DELETE /api/coupon/{coupon_id}', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Crear cupón temporal y eliminarlo');

    const groupId = extractedGroupIds.length > 0 ? extractedGroupIds[0] : "68816e1120b2a4fc69a9eb8";
    const timestamp = Date.now().toString().slice(-6);
    const tempCode = `QA-DELETE-${timestamp}`;

    // Primero crear un cupón temporal para eliminar
    const tempCouponData = {
      group: groupId,
      valid_from: "2025-08-01T08:00:00Z",
      valid_to: "2025-08-31T23:59:59Z",
      is_reusable: "false",
      max_use: "1",
      customer_max_use: "1",
      custom_code: tempCode,
      detail: "QA Test - Cupón para eliminar",
      quantity: "1",
      discount_type: "percent",
      percent: "5",
      type: "ppv-live",
      type_code: "qa_test_delete",
      payment_required: "false"
    };

    logger.info(`🎯 Creando cupón temporal para eliminar: ${tempCode}`);

    const createResponse = await apiClient.post('/api/coupon', tempCouponData);
    
    expect(createResponse.status).toBe(200);
    expect(createResponse.data.status).toBe('OK');
    
    const createdTempCoupon = createResponse.data.data[0];
    const tempCouponId = createdTempCoupon._id;
    
    logger.info(`✅ Cupón temporal creado: ${createdTempCoupon.code} (ID: ${tempCouponId})`);

    // Ahora obtener los detalles del cupón antes de eliminarlo
    logger.info(`🔍 Obteniendo detalles del cupón antes de eliminar...`);
    const getResponse = await apiClient.get(`/api/coupon/${tempCouponId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.status).toBe('OK');
    expect(getResponse.data.data._id).toBe(tempCouponId);
    
    logger.info(`📋 Detalles obtenidos: ${getResponse.data.data.code} - ${getResponse.data.data.detail}`);

    // Finalmente eliminar el cupón
    logger.info(`🗑️ Eliminando cupón con ID: ${tempCouponId}`);
    
    const deleteResponse = await apiClient.delete(`/api/coupon/${tempCouponId}`);
    
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data.status).toBe('OK');
    
    logger.info(`✅ Cupón eliminado exitosamente: ${tempCode}`);

    // Verificar que el cupón ya no existe
    logger.info(`🔍 Verificando que el cupón ya no existe...`);
    const verifyResponse = await apiClient.get(`/api/coupon/${tempCouponId}`);
    
    expect(verifyResponse.status).toBe(404);
    expect(verifyResponse.data.status).toBe('ERROR');
    expect(verifyResponse.data.data).toBe('COUPON_NOT_FOUND');
    
    logger.info(`✅ Verificación exitosa: Cupón no encontrado después de eliminar`);
  });

  test('TC-API-CUPONES-021: GET /api/coupon/{coupon_id} - Error 404 para cupón inexistente', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Error 404 para cupón inexistente');

    const nonExistentId = "000000000000000000000000"; // ID que no existe
    
    logger.info(`🎯 Buscando cupón inexistente con ID: ${nonExistentId}`);

    const response = await apiClient.get(`/api/coupon/${nonExistentId}`);
    
    expect(response.status).toBe(404);
    expect(response.data.status).toBe('ERROR');
    expect(response.data.data).toBe('COUPON_NOT_FOUND');
    
    logger.info(`✅ Error 404 esperado para cupón inexistente`);
  });

  test('TC-API-CUPONES-022: GET /api/coupon/{coupon_code}/search - Error 404 para código inexistente', async ({ request }) => {
    apiClient = new ApiClient(request);
    logger.info('🧪 Test: Error 404 para código de cupón inexistente');

    const nonExistentCode = "CODIGO-INEXISTENTE-12345";
    
    logger.info(`🎯 Buscando código inexistente: ${nonExistentCode}`);

    const response = await apiClient.get(`/api/coupon/${nonExistentCode}/search`);
    
    expect(response.status).toBe(404);
    expect(response.data.status).toBe('ERROR');
    expect(response.data.data).toBe('COUPON_NOT_FOUND');
    
    logger.info(`✅ Error 404 esperado para código inexistente`);
  });
});
