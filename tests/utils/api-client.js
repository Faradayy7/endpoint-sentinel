import { config } from '../config/environment.js';
import { Logger } from './logger.js';

/**
 * Cliente API simplificado para hacer peticiones HTTP
 * Maneja autenticación y logging automáticamente
 */
export class ApiClient {
  constructor(request) {
    this.request = request;
    this.logger = new Logger('ApiClient');
    this.baseUrl = config.api.baseUrl;
    this.defaultTimeout = config.api.timeout;
  }

  /**
   * Hace una petición GET al endpoint especificado
   * @param {string} endpoint - Endpoint de la API (ej: '/api/media')
   * @param {Object} options - Opciones de la petición
   * @param {Object} options.params - Parámetros de query
   * @param {Object} options.headers - Headers adicionales
   * @param {boolean} options.useAuth - Si usar autenticación (default: true)
   */
  async get(endpoint, options = {}) {
    const { params = {}, headers = {}, useAuth = true } = options;
    
    const url = this.buildUrl(endpoint, params);
    const requestHeaders = this.buildHeaders(headers, useAuth, 'application/json');

    this.logger.debug(`GET ${url}`, { headers: requestHeaders, params });

    try {
      const response = await this.request.get(url, {
        headers: requestHeaders,
        timeout: this.defaultTimeout,
      });

      this.logger.debug(`Response: ${response.status()}`, {
        status: response.status(),
        contentType: response.headers()['content-type'],
      });

      // Procesar respuesta automáticamente
      const processedResponse = await this.processResponse(response);
      return processedResponse;
    } catch (error) {
      this.logger.error(`GET request failed for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Hace una petición POST al endpoint especificado
   * @param {string} endpoint - Endpoint de la API (ej: '/api/coupon')
   * @param {Object} data - Datos a enviar en el body
   * @param {Object} options - Opciones de la petición
   * @param {Object} options.headers - Headers adicionales
   * @param {boolean} options.useAuth - Si usar autenticación (default: true)
   * @param {string} options.contentType - Tipo de contenido (default: 'application/json')
   */
  async post(endpoint, data = {}, options = {}) {
    const { headers = {}, useAuth = true, contentType = 'application/json' } = options;
    
    const url = this.buildUrl(endpoint);
    const requestHeaders = this.buildHeaders(headers, useAuth, contentType);

    this.logger.debug(`POST ${url}`, { headers: requestHeaders, data });

    try {
      let requestOptions = {
        headers: requestHeaders,
        timeout: this.defaultTimeout,
      };

      // Enviar como form data si es multipart/form-data o application/x-www-form-urlencoded
      if (contentType === 'application/x-www-form-urlencoded') {
        requestOptions.form = data;
      } else if (contentType === 'multipart/form-data') {
        requestOptions.multipart = data;
      } else {
        // JSON por defecto
        requestOptions.data = data;
      }

      const response = await this.request.post(url, requestOptions);

      this.logger.debug(`Response: ${response.status()}`, {
        status: response.status(),
        contentType: response.headers()['content-type'],
      });

      // Procesar respuesta automáticamente
      const processedResponse = await this.processResponse(response);
      return processedResponse;
    } catch (error) {
      this.logger.error(`POST request failed for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Hace una petición PUT al endpoint especificado
   * @param {string} endpoint - Endpoint de la API (ej: '/api/coupon/123')
   * @param {Object} data - Datos a enviar en el body
   * @param {Object} options - Opciones de la petición
   */
  async put(endpoint, data = {}, options = {}) {
    const { headers = {}, useAuth = true, contentType = 'application/json' } = options;
    
    const url = this.buildUrl(endpoint);
    const requestHeaders = this.buildHeaders(headers, useAuth, contentType);

    this.logger.debug(`PUT ${url}`, { headers: requestHeaders, data });

    try {
      const response = await this.request.put(url, {
        headers: requestHeaders,
        data: data,
        timeout: this.defaultTimeout,
      });

      this.logger.debug(`Response: ${response.status()}`, {
        status: response.status(),
        contentType: response.headers()['content-type'],
      });

      const processedResponse = await this.processResponse(response);
      return processedResponse;
    } catch (error) {
      this.logger.error(`PUT request failed for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Hace una petición DELETE al endpoint especificado
   * @param {string} endpoint - Endpoint de la API (ej: '/api/coupon/123')
   * @param {Object} options - Opciones de la petición
   */
  async delete(endpoint, options = {}) {
    const { headers = {}, useAuth = true } = options;
    
    const url = this.buildUrl(endpoint);
    const requestHeaders = this.buildHeaders(headers, useAuth, 'application/json');

    this.logger.debug(`DELETE ${url}`, { headers: requestHeaders });

    try {
      const response = await this.request.delete(url, {
        headers: requestHeaders,
        timeout: this.defaultTimeout,
      });

      this.logger.debug(`Response: ${response.status()}`, {
        status: response.status(),
        contentType: response.headers()['content-type'],
      });

      const processedResponse = await this.processResponse(response);
      return processedResponse;
    } catch (error) {
      this.logger.error(`DELETE request failed for ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Procesa la respuesta y extrae el JSON automáticamente
   * @param {APIResponse} response - Respuesta de Playwright
   */
  async processResponse(response) {
    const status = response.status();
    let data = null;

    try {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      this.logger.warn('Error al procesar respuesta:', error.message);
      data = null;
    }

    return {
      status,
      data,
      headers: response.headers(),
      ok: status >= 200 && status < 300
    };
  }

  /**
   * Construye la URL completa con parámetros de query
   */
  buildUrl(endpoint, params = {}) {
    const baseUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    if (Object.keys(params).length === 0) {
      return baseUrl;
    }

    const url = new URL(baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Si es un array, convertir a string separado por comas
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });

    return url.toString();
  }

  /**
   * Construye los headers de la petición con autenticación
   */
  buildHeaders(customHeaders = {}, useAuth = true, contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
      Accept: 'application/json',
      ...customHeaders,
    };

    // Agregar autenticación por header
    if (useAuth && config.api.token) {
      headers[config.auth.tokenHeader] = config.api.token;
    }

    return headers;
  }

  /**
   * Valida respuesta y extrae JSON
   * @param {APIResponse} response - Respuesta de Playwright
   */
  async validateAndExtractJson(response) {
    const contentType = response.headers()['content-type'] || '';
    
    if (!contentType.includes('application/json')) {
      throw new Error(`Se esperaba respuesta JSON, pero se recibió: ${contentType}`);
    }

    try {
      return await response.json();
    } catch (error) {
      this.logger.error('Error al parsear respuesta JSON:', error.message);
      throw new Error('Respuesta JSON inválida');
    }
  }

  /**
   * Verifica si la respuesta es exitosa (2xx)
   */
  isSuccessResponse(response) {
    const status = response.status();
    return status >= 200 && status < 300;
  }
}
