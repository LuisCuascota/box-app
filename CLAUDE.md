# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del Proyecto

**Box-App** es una aplicación web para la gestión financiera de una caja comunal (Kaja). Permite administrar aportes, créditos, egresos, socios y períodos contables, con generación de reportes en PDF.

## Comandos Principales

```bash
npm run dev          # Servidor de desarrollo con HMR (Vite)
npm run build        # Compilación TypeScript + build de producción
npm run lint         # Lint completo: fix automático + formato + eslint
npm run lint:fix     # Solo fix automático de ESLint
npm run format       # Formateo con Prettier
npm run preview      # Preview del build local
```

> No hay suite de tests en este proyecto.

## Arquitectura del Proyecto

### Stack Tecnológico

- **React 19** + **TypeScript 5** con Vite 7
- **Estado global**: Redux Toolkit + Redux Observable (RxJS)
- **UI**: Material-UI 7 con tema personalizado
- **Auth**: AWS Amplify 6 + Cognito
- **HTTP**: axios-observable (RxJS + Axios)
- **PDF**: jsPDF + print-js

### Estructura de `src/`

```
src/
├── assets/              # Imágenes estáticas
├── components/          # Componentes reutilizables (chart, input, loan, modals, navigation, surfaces)
├── containers/          # Páginas/vistas principales (una por módulo de negocio)
├── environments/        # Variables de ambiente (local vs AWS)
├── shared/
│   ├── constants/       # ApiRoutes, KajaConfig
│   ├── enums/           # RequestStatus, PaymentMethod, Routes, EntryTypes, Colors
│   ├── hooks/           # Store.hook: useAppDispatch, useAppSelector tipados
│   ├── labels/          # Strings de UI por módulo (centralización de textos)
│   ├── styles/          # Estilos globales (Ui.styles)
│   ├── theme/           # Sistema de theming multi-tenant (brand.config, createAppTheme)
│   └── utils/           # Utilidades: PDF, fechas, cálculos de crédito, axios
└── store/
    ├── actions/         # Redux Toolkit createAction (una por módulo)
    ├── reducers/        # Redux Slices (estado + reducers síncronos)
    ├── epics/           # Redux Observable Epics (lógica asincrónica con RxJS)
    ├── interfaces/      # Interfaces TypeScript del estado global
    ├── selectors/       # Selectores memoizados del RootState
    └── store.ts         # Configuración central: combineEpics + combineReducers
```

### Módulos de Negocio

Cada módulo (Entry, Loan, Egress, Partner, Metrics, Period, UpdateLoan) sigue la misma estructura en `containers/` y `store/`:
- `containers/<Module>/`: Header, Detail, Footer, context provider y custom hooks en `state/`
- `store/actions/<Module>.actions.ts`
- `store/reducers/<Module>.slice.ts`
- `store/epics/<Module>.epic.ts`

## Patrón Redux Observable (flujo asincrónico)

Toda la lógica asincrónica sigue este flujo:

1. **Acción disparada** desde un componente vía `useAppDispatch()`
2. **Epic intercepta** la acción con `filter(action.match)`
3. **Llamada HTTP** con `axios-observable` (retorna Observable)
4. **Reducers actualizan** el estado vía `dispatch` dentro del epic
5. **Componente re-renderiza** al leer el estado con `useAppSelector(selector)`

```typescript
// Ejemplo de Epic estándar
export const getDataEpic: EpicCustom = ({ action$, dispatch }) =>
  action$.pipe(
    filter(getData.match),
    tap(() => dispatch(setStatus(RequestStatusEnum.PENDING))),
    switchMap(({ payload }) =>
      axios.get(`${ApiRoutes.ENDPOINT}/${payload}`).pipe(
        tap(({ data }) => {
          dispatch(setData(data));
          dispatch(setStatus(RequestStatusEnum.SUCCESS));
        }),
        catchError(() => {
          dispatch(setStatus(RequestStatusEnum.ERROR));
          return EMPTY;
        })
      )
    ),
    ignoreElements()
  );
```

## Patrón de Containers y Contexto

Los containers usan React Context para compartir estado local entre sub-componentes, sin propagarlo al store de Redux:

```typescript
// Container con layout rediseñado (Entry como referencia)
export const EntryContainer = () => (
  <Container fixed>
    <Paper sx={{ overflow: "hidden" }}>
      <EntryContextProvider>
        <EntryHeader />
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}><EntryDetail /></Grid>
            <Grid size={{ xs: 12, md: 5 }}><EntryPartnerPanel /></Grid>
          </Grid>
        </Box>
        <EntryFooter />
      </EntryContextProvider>
    </Paper>
  </Container>
);
```

Los containers legacy todavía usan `PaperBase` como wrapper (migración progresiva).

## API y Autenticación

- **Base URL local**: `http://localhost:3000/local`
- **Base URL producción**: AWS API Gateway (en `environments/`)
- **Autenticación**: JWT de Cognito insertado en `Authorization: Bearer {token}` por `Axios.util.ts`
- **Modo offline**: `isOffline = true` en `App.tsx` desactiva la autenticación (útil en desarrollo)
- **Rutas API**: Todas definidas en `shared/constants/ApiRoutes.ts`

## Generación de PDFs

Cada módulo tiene su propio util de PDF en `shared/utils/`:
- `BuildEntryPdf.utils.ts`, `BuildLoanPdf.utils.ts`, `BuildEgressPdf.utils.ts`
- Lógica de layout compartida en `pdf.utils.ts` (fuentes, colores, posicionamiento)
- Se usa jsPDF para construcción y print-js para impresión

## Convenciones de Código

- **Nombrado**: PascalCase para componentes/containers/interfaces, camelCase para hooks y utilities
- **Textos de UI**: Siempre en `shared/labels/<Module>.labels.ts`, nunca hardcodeados en componentes
- **Estados asíncronos**: Siempre usar `RequestStatusEnum` (PENDING / SUCCESS / ERROR)
- **Hooks tipados**: Usar `useAppDispatch()` y `useAppSelector` de `shared/hooks/Store.hook.ts`
- **Estilo**: Prettier con double quotes, semicolons, trailing commas ES5, tab width 2

## Sistema de Theming Multi-Tenant

El tema se configura en `src/shared/theme/`:
- `brand.config.ts` — Define `BrandConfig` (paleta, tipografía, shape) e incluye `kajaBrand` como configuración actual
- `createAppTheme.ts` — Genera el MUI theme a partir de cualquier `BrandConfig`
- `index.ts` — Barrel exports

Para dar servicio a otra caja: crear un nuevo `BrandConfig` y pasarlo a `createAppTheme()` en `main.tsx`.

**Paleta Kaja actual:**
- **Primario**: `#1B3A57` (azul oscuro) — light: `#3F6B8A`, dark: `#112B40`
- **Secundario**: `#FFB347` (naranja)
- **Fuente**: Libre Franklin
- **Radios**: botones 10px, inputs 8px, papers 12px

## Patrón de Layout de Pantallas (nuevo)

Las pantallas rediseñadas siguen este patrón:
- **Header**: Gradiente primary fusionado con el borde superior del Paper (sin separación, sin borderRadius propio)
- **Contenido**: Grid de 2 columnas (md:7 detalle + md:5 panel lateral)
- **Footer**: Gradiente primary fusionado con el borde inferior, mismo grid de 2 columnas
- **Container propio** en vez de PaperBase, con `overflow: hidden` en el Paper

```typescript
// Estructura de un container rediseñado
<Paper sx={{ overflow: "hidden" }}>
  <Header />         {/* gradiente pegado arriba */}
  <Box p={2}>
    <Grid container>
      <Grid md={7}><Detail /></Grid>
      <Grid md={5}><SidePanel /></Grid>
    </Grid>
  </Box>
  <Footer />         {/* gradiente pegado abajo */}
</Paper>
```