/**
 * Utilidad para compartir datos entre tests
 * Almacena datos obtenidos de la API para usar en validaciones posteriores
 */
export class TestDataManager {
  constructor() {
    this.sharedData = {
      sampleMedia: null,
      mediaList: [],
      availableIds: [],
      availableTitles: [],
      availableCategories: [],
      availableTags: [],
      availableTypes: [],
    };
  }

  /**
   * Procesa la respuesta inicial de la API y extrae datos útiles para tests
   */
  processInitialData(apiResponse) {
    if (!apiResponse) return;

    // Si es un array de medias
    if (Array.isArray(apiResponse)) {
      this.sharedData.mediaList = apiResponse;
      this.extractDataFromMediaList(apiResponse);
    } 
    // Si es un objeto con array de datos
    else if (apiResponse.data && Array.isArray(apiResponse.data)) {
      this.sharedData.mediaList = apiResponse.data;
      this.extractDataFromMediaList(apiResponse.data);
    }
    // Si es un objeto con propiedades de media
    else if (apiResponse.results && Array.isArray(apiResponse.results)) {
      this.sharedData.mediaList = apiResponse.results;
      this.extractDataFromMediaList(apiResponse.results);
    }
    // Si es un solo objeto de media
    else if (apiResponse.id || apiResponse._id) {
      this.sharedData.sampleMedia = apiResponse;
      this.extractDataFromSingleMedia(apiResponse);
    }
  }

  /**
   * Extrae datos útiles de una lista de medias
   */
  extractDataFromMediaList(mediaList) {
    if (!mediaList || mediaList.length === 0) return;

    // Tomar el primer elemento como muestra
    this.sharedData.sampleMedia = mediaList[0];

    // Extraer IDs únicos
    this.sharedData.availableIds = mediaList
      .map(media => media.id || media._id)
      .filter(id => id)
      .slice(0, 5); // Solo los primeros 5

    // Extraer títulos únicos
    this.sharedData.availableTitles = mediaList
      .map(media => media.title)
      .filter(title => title && title.trim())
      .slice(0, 5);

    // Extraer tipos únicos
    this.sharedData.availableTypes = [...new Set(
      mediaList
        .map(media => media.type)
        .filter(type => type)
    )];

    // Extraer categorías si existen
    mediaList.forEach(media => {
      if (media.categories && Array.isArray(media.categories)) {
        media.categories.forEach(cat => {
          if (cat.id && !this.sharedData.availableCategories.includes(cat.id)) {
            this.sharedData.availableCategories.push(cat.id);
          }
        });
      }
    });

    // Extraer tags si existen
    mediaList.forEach(media => {
      if (media.tags && Array.isArray(media.tags)) {
        media.tags.forEach(tag => {
          const tagName = tag.name || tag;
          if (tagName && !this.sharedData.availableTags.includes(tagName)) {
            this.sharedData.availableTags.push(tagName);
          }
        });
      }
    });
  }

  /**
   * Extrae datos de un solo objeto de media
   */
  extractDataFromSingleMedia(media) {
    if (media.id || media._id) {
      this.sharedData.availableIds.push(media.id || media._id);
    }
    if (media.title) {
      this.sharedData.availableTitles.push(media.title);
    }
    if (media.type) {
      this.sharedData.availableTypes.push(media.type);
    }
  }

  /**
   * Obtiene un ID aleatorio de los disponibles
   */
  getRandomId() {
    const ids = this.sharedData.availableIds;
    return ids.length > 0 ? ids[Math.floor(Math.random() * ids.length)] : null;
  }

  /**
   * Obtiene un título aleatorio de los disponibles
   */
  getRandomTitle() {
    const titles = this.sharedData.availableTitles;
    return titles.length > 0 ? titles[Math.floor(Math.random() * titles.length)] : null;
  }

  /**
   * Obtiene una palabra del título para búsqueda
   */
  getSearchWordFromTitle() {
    const title = this.getRandomTitle();
    if (!title) return null;
    
    // Tomar la primera palabra que tenga más de 3 caracteres
    const words = title.split(' ').filter(word => word.length > 3);
    return words.length > 0 ? words[0] : title.substring(0, 5);
  }

  /**
   * Obtiene un tipo de media disponible
   */
  getAvailableType() {
    const types = this.sharedData.availableTypes;
    return types.length > 0 ? types[0] : 'video';
  }

  /**
   * Obtiene una categoría disponible
   */
  getAvailableCategory() {
    const categories = this.sharedData.availableCategories;
    return categories.length > 0 ? categories[0] : null;
  }

  /**
   * Obtiene un tag disponible
   */
  getAvailableTag() {
    const tags = this.sharedData.availableTags;
    return tags.length > 0 ? tags[0] : null;
  }

  /**
   * Verifica si hay datos suficientes para las pruebas
   */
  hasValidData() {
    return this.sharedData.availableIds.length > 0 || this.sharedData.sampleMedia;
  }

  /**
   * Obtiene información de duración para filtros
   */
  getDurationInfo() {
    const media = this.sharedData.sampleMedia;
    if (media && media.duration) {
      return {
        sampleDuration: media.duration,
        minDuration: Math.max(0, media.duration - 1000), // 1000 segundos menos
        maxDuration: media.duration + 1000, // 1000 segundos más
      };
    }
    return null;
  }

  /**
   * Obtiene información de vistas para filtros
   */
  getViewsInfo() {
    const media = this.sharedData.sampleMedia;
    if (media && (media.views || media.view_count)) {
      const views = media.views || media.view_count;
      return {
        sampleViews: views,
        minViews: Math.max(0, views - 1000),
        maxViews: views + 1000,
      };
    }
    return null;
  }

  /**
   * Obtiene información de fechas para filtros
   */
  getDateInfo() {
    const media = this.sharedData.sampleMedia;
    if (media) {
      const createdDate = media.created_at || media.date_created || media.createdAt;
      if (createdDate) {
        const date = new Date(createdDate);
        const dayBefore = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        const dayAfter = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        
        return {
          sampleDate: date.toISOString(),
          createdAfter: dayBefore.toISOString(),
          createdBefore: dayAfter.toISOString(),
        };
      }
    }
    return null;
  }

  /**
   * Imprime resumen de datos disponibles (para debug)
   */
  printSummary(logger) {
    logger.info('📊 Datos disponibles para pruebas:');
    logger.info(`   IDs: ${this.sharedData.availableIds.length} disponibles`);
    logger.info(`   Títulos: ${this.sharedData.availableTitles.length} disponibles`);
    logger.info(`   Tipos: ${this.sharedData.availableTypes.join(', ')}`);
    logger.info(`   Categorías: ${this.sharedData.availableCategories.length} disponibles`);
    logger.info(`   Tags: ${this.sharedData.availableTags.length} disponibles`);
    
    if (this.sharedData.sampleMedia) {
      logger.info(`   Media de muestra: ${this.sharedData.sampleMedia.title || 'Sin título'}`);
    }
  }
}

// Instancia global para compartir entre tests
export const testDataManager = new TestDataManager();
