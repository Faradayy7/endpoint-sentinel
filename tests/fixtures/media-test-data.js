/**
 * Datos de prueba para el endpoint /api/media
 * Aquí se definen todos los parámetros y casos de prueba
 */

// Parámetros básicos
export const basicParams = {
  // Paginación
  limit: 10,
  skip: 0,
  count: false,

  // Filtros básicos
  all: false,
  published: true,
  type: 'all',
  status: 'OK',
};

// Casos de prueba para filtros de texto
export const textFilters = {
  titleExact: {
    title: 'video',
    'title-rule': 'is',
  },
  titleContains: {
    title: 'video',
    'title-rule': 'contains',
  },
  titleStartsWith: {
    title: 'video',
    'title-rule': 'starts_with',
  },
  titleEndsWith: {
    title: 'video',
    'title-rule': 'ends_with',
  },
  querySearch: {
    query: 'video',
  },
  descriptionFilter: {
    description: 'Hello',
  },
};

// Casos de prueba para filtros de duración
export const durationFilters = {
  minDuration: {
    min_duration: 6000,
  },
  maxDuration: {
    max_duration: 18000,
  },
  durationRange: {
    min_duration: 6000,
    max_duration: 18000,
  },
};

// Casos de prueba para filtros de vistas
export const viewFilters = {
  minViews: {
    min_views: 1000,
  },
  maxViews: {
    max_views: 50000,
  },
  viewRange: {
    min_views: 1000,
    max_views: 50000,
  },
};

// Casos de prueba para filtros de fechas
export const dateFilters = {
  createdAfter: {
    created_after: '2020-06-18T15:37:40.675Z',
  },
  createdBefore: {
    created_before: '2023-06-18T15:37:40.675Z',
  },
  recordedDateRange: {
    recorded_after: '2020-01-01T00:00:00.000Z',
    recorded_before: '2023-12-31T23:59:59.999Z',
  },
  availabilityDateRange: {
    available_from: '2020-01-01T00:00:00.000Z',
    available_until: '2024-12-31T23:59:59.999Z',
  },
};

// Casos de prueba para filtros de categorías
export const categoryFilters = {
  filterByCategories: {
    filter_categories: '5ee18728ccc0ec8debbeb9i4,5ee18728ccc0ce5dhgfeb5u8',
    'categories-rule': 'in_any',
  },
  categoriesInAll: {
    filter_categories: '5ee18728ccc0ec8debbeb9i4',
    'categories-rule': 'in_all',
  },
  withoutCategory: {
    without_category: true,
  },
  withSubCategories: {
    filter_categories: '5ee18728ccc0ec8debbeb9i4',
    with_sub_categories: true,
  },
};

// Casos de prueba para filtros de tags
export const tagFilters = {
  tagsByName: {
    tag: 'tag1,tag2',
    'tags-rule': 'in_any',
  },
  tagsInAll: {
    tag: 'tag1,tag2',
    'tags-rule': 'in_all',
  },
  tagsIn: {
    tag: 'tag1,tag2',
    tags_in: true,
  },
};

// Casos de prueba para ordenamiento
export const sortingOptions = {
  dateCreatedDesc: {
    sort: '-date_created',
  },
  dateCreatedAsc: {
    sort: 'date_created',
  },
  titleAsc: {
    sort: 'title',
  },
  titleDesc: {
    sort: '-title',
  },
};

// Casos de prueba para paginación
export const paginationTests = {
  firstPage: {
    limit: 10,
    skip: 0,
  },
  secondPage: {
    limit: 10,
    skip: 10,
  },
  largeLimit: {
    limit: 100,
    skip: 0,
  },
  smallLimit: {
    limit: 5,
    skip: 0,
  },
};

// Casos de prueba para autenticación
export const authTests = {
  withTokenHeader: {
    useAuth: true,
    method: 'header',
  },
  withTokenQuery: {
    useAuth: true,
    method: 'query',
    token: process.env.API_TOKEN,
  },
  withoutAuth: {
    useAuth: false,
  },
};

// Valores inválidos para pruebas negativas
export const invalidParams = {
  invalidLimit: {
    limit: -1,
  },
  invalidSkip: {
    skip: -1,
  },
  invalidDateFormat: {
    created_after: 'fecha-invalida',
  },
  invalidTitleRule: {
    title: 'video',
    'title-rule': 'regla-invalida',
  },
  invalidType: {
    type: 'tipo-invalido',
  },
  invalidStatus: {
    status: 'STATUS-INVALIDO',
  },
};

// Casos de prueba combinados para escenarios reales
export const combinedScenarios = {
  videoSearchWithPagination: {
    type: 'video',
    query: 'tutorial',
    limit: 20,
    skip: 0,
    sort: '-date_created',
  },
  publishedAudioWithCategories: {
    type: 'audio',
    published: true,
    filter_categories: '5ee18728ccc0ec8debbeb9i4',
    'categories-rule': 'in_any',
    limit: 50,
  },
  recentVideosWithDuration: {
    type: 'video',
    created_after: '2023-01-01T00:00:00.000Z',
    min_duration: 300,
    max_duration: 3600,
    sort: '-date_created',
  },
};
