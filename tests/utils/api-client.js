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
    const requestHeaders = this.buildHeaders(headers, useAuth);

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

      return response;
    } catch (error) {
      this.logger.error(`GET request failed for ${url}:`, error.message);
      throw error;
    }
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
  buildHeaders(customHeaders = {}, useAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
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
