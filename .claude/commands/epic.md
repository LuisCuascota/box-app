Agrega una nueva operación asincrónica (epic + estado) a un módulo existente del proyecto box-app.

Argumentos: $ARGUMENTS
Formato esperado: `<NombreModulo> <nombreOperacion>`
Ejemplo: `Loan getInstallmentDetail`

## Paso 1 — Explorar la capa store del módulo

Usa un subagente Explore para leer exclusivamente la capa Redux del módulo:
- `src/store/actions/<Module>.actions.ts`
- `src/store/epics/<Module>.epic.ts`
- `src/store/reducers/<Module>.slice.ts`
- `src/store/selectors/<Module>.selectors.ts`
- `src/store/interfaces/<Module>.interface.ts` (si existe)
- `src/shared/constants/ApiRoutes.ts` — para ver las rutas existentes
- `src/shared/labels/<Module>.labels.ts`

## Paso 2 — Presentar el plan

Antes de tocar cualquier archivo, presenta el plan con este formato:

---
### Plan: nueva operación `<nombreOperacion>` en módulo `<NombreModulo>`

**1. Nueva acción** en `store/actions/<Module>.actions.ts`:
```typescript
// Mostrar la firma exacta de la acción a crear
export const <nombreOperacion> = createAction<TipoPayload>("<module>/<nombreOperacion>");
```

**2. Nuevo estado** en `store/reducers/<Module>.slice.ts`:
```typescript
// Mostrar los campos nuevos a agregar al state shape
<campo>: TipoDato;
<campoStatus>: RequestStatusEnum;
```

**3. Nuevo epic** en `store/epics/<Module>.epic.ts`:
```typescript
// Mostrar la firma completa del epic con el patrón estándar del proyecto
export const <nombreOperacion>Epic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(<nombreOperacion>.match),
    ...
  );
```

**4. Nuevo selector** en `store/selectors/<Module>.selectors.ts`:
```typescript
// Mostrar los selectores nuevos
```

**5. Ruta API**: `ApiRoutes.<NUEVA_RUTA>` — indicar si es nueva o existente.

**Integración requerida:**
- [ ] Agregar epic al `combineEpics` en `store/store.ts` (si aplica)
- [ ] Agregar ruta en `ApiRoutes.ts` (solo si es nueva)
---

## Paso 3 — Esperar confirmación

Pregunta: **"¿Procedo con la implementación?"**

No edites ningún archivo hasta recibir confirmación explícita.

## Paso 4 — Implementar

Solo tras confirmación, edita en este orden:
1. `ApiRoutes.ts` — solo si se necesita ruta nueva
2. `<Module>.interface.ts` — tipos nuevos
3. `<Module>.actions.ts` — nueva acción
4. `<Module>.slice.ts` — nuevo estado + reducer
5. `<Module>.selectors.ts` — nuevo selector
6. `<Module>.epic.ts` — nuevo epic con patrón estándar:
   ```typescript
   export const <nombreOperacion>Epic: EpicCustom = ({ action$, dispatch }) =>
     action$.pipe(
       filter(<nombreOperacion>.match),
       tap(() => dispatch(set<NombreStatus>(RequestStatusEnum.PENDING))),
       switchMap(({ payload }) =>
         axios.get(`${ApiRoutes.<RUTA>}/${payload}`).pipe(
           tap(({ data }) => {
             dispatch(set<NombreDato>(data));
             dispatch(set<NombreStatus>(RequestStatusEnum.SUCCESS));
           }),
           catchError(() => {
             dispatch(set<NombreStatus>(RequestStatusEnum.ERROR));
             return EMPTY;
           })
         )
       ),
       ignoreElements()
     );
   ```
7. `store.ts` — agregar el nuevo epic al combineEpics

Ejecuta `npm run lint` al finalizar y corrige cualquier error.
