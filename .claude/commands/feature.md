Agrega una nueva funcionalidad a un módulo existente del proyecto box-app.

Feature solicitada: $ARGUMENTS

## Paso 1 — Explorar el módulo

Usa un subagente Explore para leer completamente el módulo involucrado. El subagente debe leer:
- `src/containers/<Module>/` — todos los archivos (Header, Detail, Footer, context, hooks en state/)
- `src/store/actions/<Module>.actions.ts`
- `src/store/epics/<Module>.epic.ts`
- `src/store/reducers/<Module>.slice.ts`
- `src/store/selectors/<Module>.selectors.ts`
- `src/store/interfaces/<Module>.interface.ts` (si existe)
- `src/shared/labels/<Module>.labels.ts`

Si la feature involucra más de un módulo, leer ambos.

## Paso 2 — Presentar el plan

Antes de tocar cualquier archivo, presenta el plan con este formato exacto:

---
### Plan de implementación: [nombre de la feature]

**Módulo(s) afectado(s):** [lista]

**Archivos a modificar:**
| Archivo | Cambio |
|---------|--------|
| `ruta/al/archivo.ts` | Descripción concisa del cambio |

**Archivos a crear** (solo si es estrictamente necesario):
| Archivo | Propósito |
|---------|-----------|
| `ruta/nuevo.ts` | Para qué sirve |

**Flujo de datos:**
[Descripción en 3-5 líneas de cómo fluye la data: acción disparada → epic → HTTP → reducer → selector → componente]

**Convenciones aplicadas:**
- [Lista de convenciones del proyecto que aplican: RequestStatusEnum, labels centralizados, etc.]

**Lo que NO cambia:**
[Lista de archivos/lógica que se mantiene intacta para no romper funcionalidad existente]
---

## Paso 3 — Esperar confirmación

Pregunta: **"¿Procedo con la implementación?"**

No edites ningún archivo hasta recibir confirmación explícita del usuario.

## Paso 4 — Implementar

Solo tras confirmación:
- Edita los archivos listados en el plan, en el orden indicado
- Sigue estrictamente las convenciones de `CLAUDE.md`:
  - Textos de UI siempre en `shared/labels/<Module>.labels.ts`
  - Estados async con `RequestStatusEnum` (PENDING / SUCCESS / ERROR)
  - Hooks tipados con `useAppDispatch()` y `useAppSelector`
  - Epics con el patrón estándar: filter → tap(PENDING) → switchMap → tap(SUCCESS/ERROR) → ignoreElements
  - Nunca hardcodear strings en componentes
- Ejecuta `npm run lint` al finalizar y corrige cualquier error antes de reportar
