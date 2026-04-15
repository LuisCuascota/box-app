Analiza un módulo existente del proyecto box-app, detecta desviaciones de las convenciones del proyecto y propone mejoras concretas.

Módulo a analizar: $ARGUMENTS
Ejemplo: `Loan` o `EgressHistory`

## Paso 1 — Explorar el módulo completo

Usa un subagente Explore para leer todos los archivos del módulo:
- `src/containers/<Module>/` — todos los archivos recursivamente
- `src/store/actions/<Module>.actions.ts`
- `src/store/epics/<Module>.epic.ts`
- `src/store/reducers/<Module>.slice.ts`
- `src/store/selectors/<Module>.selectors.ts`
- `src/store/interfaces/<Module>.interface.ts` (si existe)
- `src/shared/labels/<Module>.labels.ts`

## Paso 2 — Analizar contra las convenciones del proyecto

Evalúa el módulo contra estas reglas (extraídas del CLAUDE.md del proyecto):

**Store / Redux Observable:**
- [ ] Todos los estados async usan `RequestStatusEnum` (PENDING/SUCCESS/ERROR)
- [ ] Los epics siguen el patrón: `filter → tap(PENDING) → switchMap → tap(SUCCESS) → catchError(ERROR) → ignoreElements`
- [ ] No hay lógica async fuera de epics
- [ ] Los hooks usan `useAppDispatch()` y `useAppSelector` tipados

**UI / Componentes:**
- [ ] Ningún string de UI está hardcodeado en componentes (todo en `labels/`)
- [ ] Se usan los colores del tema MUI, no valores hexadecimales directos

**Código:**
- [ ] Sin código duplicado respecto a otros módulos (lógica extraíble a utils)
- [ ] Sin imports innecesarios o variables sin usar
- [ ] Convenciones de nombrado: PascalCase componentes, camelCase hooks/utils

## Paso 3 — Presentar el informe

Presenta el análisis con este formato:

---
### Informe de mejoras: módulo `<Module>`

**Estado general:** [Bueno / Tiene desvíos menores / Requiere refactor]

**Desvíos encontrados:**
| # | Archivo | Línea(s) | Problema | Impacto |
|---|---------|----------|----------|---------|
| 1 | `ruta/archivo.ts` | L42 | Descripción del problema | Alto/Medio/Bajo |

**Sin problemas en:**
- [Lista de aspectos que están bien implementados]

**Mejoras propuestas** (ordenadas por impacto):
1. **[Título]** — `archivo.ts:línea` — Descripción de qué cambiar y por qué
2. ...

**Estimación:** [N] archivos afectados, [N] cambios puntuales
---

## Paso 4 — Esperar confirmación

Pregunta: **"¿Aplico las mejoras?"**

Puedes responder:
- `sí` / `todas` — aplica todos los cambios propuestos
- `1,3` — aplica solo los cambios numerados indicados
- `no` — cancela sin tocar nada

No edites ningún archivo hasta recibir respuesta.

## Paso 5 — Implementar

Solo los cambios confirmados. No hagas mejoras de "oportunidad" fuera del plan aprobado.
Ejecuta `npm run lint` al finalizar y corrige cualquier error.
