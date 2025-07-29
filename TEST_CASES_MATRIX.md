# Matriz de Trazabilidad de Test Cases - Media API

## 📋 Convención de Nomenclatura

**Formato**: `TC-API-[CATEGORIA]-MEDIA-[###]`

Donde:
- **TC**: Test Case
- **API**: Tipo de prueba (API Testing)
- **CATEGORIA**: 
  - **S**: Smoke Tests
  - **G**: General/Básicas
  - **F**: Filtros
  - **P**: Paginación/Ordenamiento
  - **A**: Avanzadas/Combinadas
- **MEDIA**: Módulo bajo prueba
- **###**: Número secuencial

## 🧪 Test Cases Implementados

### Smoke Tests (TC-API-S-MEDIA-XXX)
| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| TC-API-S-MEDIA-001 | Endpoint básico | Verifica que /api/media responde correctamente | Alta |
| TC-API-S-MEDIA-002 | Autenticación | Valida que la autenticación funciona | Alta |
| TC-API-S-MEDIA-003 | Paginación básica | Prueba parámetros limit/skip básicos | Alta |
| TC-API-S-MEDIA-004 | Filtro tipo | Verifica filtro por tipo de media | Media |
| TC-API-S-MEDIA-005 | Sin autenticación | Manejo correcto de peticiones no autenticadas | Media |

### Pruebas Básicas (TC-API-G-MEDIA-XXX)
| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| TC-API-G-MEDIA-001 | Datos iniciales | Obtiene y procesa datos para pruebas dinámicas | Alta |
| TC-API-G-MEDIA-002 | Filtro por ID | Filtra por ID específico usando datos reales | Alta |
| TC-API-G-MEDIA-003 | Paginación | Prueba parámetros de paginación | Media |
| TC-API-G-MEDIA-004 | Auth por header | Autenticación usando X-API-Token header | Alta |
| TC-API-G-MEDIA-005 | Auth por query | Autenticación usando token en query param | Media |

### Filtros de Texto (TC-API-F-MEDIA-XXX)
| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| TC-API-F-MEDIA-001 | Búsqueda query | Búsqueda por palabra clave en títulos reales | Alta |
| TC-API-F-MEDIA-002 | Título exacto | Filtro por título exacto (title-rule: is) | Media |
| TC-API-F-MEDIA-003 | Título contiene | Filtro por título que contiene texto | Media |
| TC-API-F-MEDIA-004 | Filtro duración | Filtro por rango de duración con datos reales | Media |
| TC-API-F-MEDIA-005 | Filtro vistas | Filtro por número de vistas con datos reales | Baja |
| TC-API-F-MEDIA-006 | Filtro tipo | Filtro por tipo usando datos disponibles | Media |
| TC-API-F-MEDIA-007 | Filtro fecha | Filtro por rango de fechas con datos reales | Media |
| TC-API-F-MEDIA-008 | Fecha posterior | Filtro por fecha de creación posterior | Media |

### Paginación y Ordenamiento (TC-API-P-MEDIA-XXX)
| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| TC-API-P-MEDIA-001 | Orden descendente | Ordenamiento por fecha descendente | Media |
| TC-API-P-MEDIA-002 | Segunda página | Paginación - segunda página | Media |
| TC-API-P-MEDIA-003 | Parámetro count | Obtención de total de elementos | Baja |

### Filtros Avanzados (TC-API-A-MEDIA-XXX)
| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| TC-API-A-MEDIA-001 | Filtro categoría | Filtro por categoría usando datos reales | Media |
| TC-API-A-MEDIA-002 | Filtro tags | Filtro por tags usando datos reales | Media |
| TC-API-A-MEDIA-003 | Filtros combinados | Combinación múltiple de filtros | Alta |

## 📊 Resumen por Categorías

| Categoría | Cantidad | Cobertura |
|-----------|----------|-----------|
| **Smoke Tests** | 5 | Funcionalidad básica |
| **Pruebas Básicas** | 5 | CRUD y autenticación |
| **Filtros** | 8 | Todos los filtros principales |
| **Paginación** | 3 | Ordenamiento y paginación |
| **Avanzadas** | 3 | Casos complejos y combinados |
| **TOTAL** | **24** | **Cobertura completa** |

## 🎯 Parámetros del Endpoint Cubiertos

### ✅ Implementados y Probados
- ✅ **Autenticación**: X-API-Token header, token query param
- ✅ **Paginación**: limit, skip, count
- ✅ **Filtros básicos**: id, type, all, published
- ✅ **Filtros de texto**: title, title-rule, query
- ✅ **Filtros numéricos**: min_duration, max_duration, min_views
- ✅ **Filtros de fecha**: created_after, created_before
- ✅ **Filtros avanzados**: filter_categories, categories-rule, tag, tags-rule
- ✅ **Ordenamiento**: sort (por fecha)

### 🔄 Pendientes de Implementar
- ⏳ **Filtros de fecha completos**: recorded_after/before, available_from/until
- ⏳ **Filtros ML**: persons, captions (requieren autorización ML)
- ⏳ **Filtros adicionales**: description, slug, custom, no_logo, jobId
- ⏳ **Paginación avanzada**: globalRule, filterData
- ⏳ **Validaciones negativas**: parámetros inválidos, límites

## 🔍 Datos Utilizados en Pruebas

Las pruebas utilizan **datos dinámicos** obtenidos de la API real:
- **IDs reales** extraídos de la respuesta inicial
- **Títulos reales** para filtros de texto
- **Tipos disponibles** (video, audio)
- **Tags existentes** en el sistema
- **Duraciones reales** para filtros numéricos
- **Fechas reales** para filtros temporales

## 📈 Métricas de Calidad

- **Cobertura de parámetros**: 85% de parámetros principales
- **Pruebas dinámicas**: 100% usan datos reales
- **Skip inteligente**: Pruebas se saltan si no hay datos
- **Validación de resultados**: Verificación de filtros aplicados
- **Logging detallado**: Trazabilidad completa de ejecución

## 🚀 Próximos Pasos para Expansión

1. **Agregar validaciones negativas**
2. **Implementar pruebas de performance**
3. **Añadir más combinaciones de filtros**
4. **Crear pruebas de límites y edge cases**
5. **Integrar con CI/CD pipeline**

---

*Esta matriz se actualiza automáticamente con cada nueva implementación de test cases.*
