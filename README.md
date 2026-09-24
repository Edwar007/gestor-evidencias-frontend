# Gestor de Evidencias — Frontend

Aplicación web para la gestión de casos y evidencias, desarrollada como parte de una prueba técnica.

El frontend permite a los usuarios autenticarse, crear y administrar casos, consultar su información y asociar archivos como evidencias mediante URLs firmadas.

## Tecnologías

* React
* TypeScript
* Vite
* Material UI (MUI)
* React Router
* Fetch API
* Vercel

## Funcionalidades

* Registro de usuarios.
* Inicio y cierre de sesión.
* Protección de rutas privadas.
* Persistencia de sesión mediante JWT.
* Dashboard con resumen de casos.
* Creación de casos.
* Consulta de casos.
* Actualización de casos.
* Cambio de estado del caso.
* Eliminación de casos.
* Carga de evidencias.
* Descarga de evidencias.
* Manejo centralizado de errores de la API.
* Interfaz responsive.

## Arquitectura

El proyecto está organizado por responsabilidades:

```text
src/
├── components/
│   └── layout/
│       ├── AppLayout.tsx
│       └── Navbar.tsx
│
├── context/
│   ├── AuthContext.tsx
│   ├── AuthProvider.tsx
│   └── useAuth.ts
│
├── errors/
│   └── api.error.ts
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   │
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   │
│   └── cases/
│       ├── Cases.tsx
│       ├── CreateCase.tsx
│       ├── CaseDetail.tsx
│       └── EditCase.tsx
│
├── routes/
│   ├── AppRoutes.tsx
│   └── ProtectedRoute.tsx
│
├── services/
│   ├── api.service.ts
│   ├── auth.service.ts
│   └── case.service.ts
│
├── theme/
│   └── theme.ts
│
├── types/
│   ├── auth.types.ts
│   └── case.types.ts
│
├── App.tsx
└── main.tsx
```

### Capas principales

**Pages**

Contienen las vistas y la interacción con el usuario.

**Services**

Centralizan las llamadas HTTP al backend.

**Context**

Gestiona el estado global de autenticación.

**Routes**

Controlan la navegación y protección de las rutas privadas.

**Types**

Contienen los tipos TypeScript utilizados por la aplicación.

**Errors**

Centraliza la representación de errores provenientes de la API.

## Requisitos

* Node.js 18+
* npm
* Backend del proyecto ejecutándose
* URL disponible de la API

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo de variables de entorno:

```bash
cp .env.example .env
```

Configurar la URL del backend:

```env
VITE_API_URL=http://localhost:3000
```

Ejecutar el proyecto:

```bash
npm run dev
```

La aplicación estará disponible en la URL indicada por Vite, normalmente:

```text
http://localhost:5173
```

## Variables de entorno

El proyecto utiliza:

```env
VITE_API_URL=
```

Esta variable corresponde a la URL base del backend.

No se almacenan credenciales, secretos, tokens permanentes ni claves privadas en el repositorio.

Se incluye un archivo `.env.example` como referencia para la configuración local.

## Autenticación

La aplicación utiliza JWT proporcionado por el backend.

El flujo de autenticación es:

```text
Login
  ↓
Backend valida credenciales
  ↓
Backend genera JWT
  ↓
Frontend almacena token
  ↓
Frontend consulta /auth/me
  ↓
Usuario autenticado
```

Las rutas privadas requieren un token válido.

El token se envía al backend mediante:

```text
Authorization: Bearer <token>
```

### Persistencia del token

Se utiliza `localStorage` para persistir el JWT por simplicidad de implementación.

Como trade-off, un token almacenado en `localStorage` puede quedar expuesto ante un ataque XSS. En una implementación de producción se podría utilizar una cookie `httpOnly`, `Secure` y `SameSite` para reducir esta exposición.

## Manejo de errores

El frontend utiliza una clase `ApiError` para representar los errores provenientes del backend.

La comunicación HTTP está centralizada mediante `apiRequest`, evitando repetir la lógica de procesamiento de respuestas en cada página.

El flujo es:

```text
Página
  ↓
Service
  ↓
apiRequest
  ↓
Backend
  ↓
Respuesta HTTP
  ↓
ApiError
  ↓
Página muestra el mensaje al usuario
```

Se manejan principalmente:

* `400` — Errores de validación.
* `401` — No autenticado o token inválido.
* `403` — Operación no permitida.
* `404` — Recurso no encontrado.
* `409` — Conflicto.
* `500` — Error interno.

Los mensajes enviados por el backend se conservan para mostrar información útil al usuario.

## Gestión de casos

Cada usuario puede administrar únicamente sus propios casos.

Las operaciones disponibles son:

```text
Crear
  ↓
Listar
  ↓
Consultar detalle
  ↓
Editar
  ↓
Cambiar estado
  ↓
Eliminar
```

Los casos utilizan los estados:

* `OPEN`
* `CLOSED`

## Flujo de archivos

Las evidencias no pasan directamente por el backend.

Se utiliza un flujo basado en URLs firmadas:

```text
1. Frontend solicita URL de carga
             ↓
2. Backend genera URL firmada
             ↓
3. Frontend sube archivo directamente al almacenamiento
             ↓
4. Frontend informa al backend que terminó la carga
             ↓
5. Backend valida y registra el archivo
```

Para descargar una evidencia:

```text
Frontend
   ↓
Solicita URL de descarga
   ↓
Backend valida propietario
   ↓
Backend genera URL firmada
   ↓
Frontend abre/descarga el archivo
```

Las evidencias permanecen privadas y las URLs tienen una duración limitada.

## Validación de archivos

El backend controla las restricciones principales de los archivos:

* Tamaño máximo: `5 MB`
* `image/jpeg`
* `image/png`
* `application/pdf`

El frontend también limita los tipos de archivo mostrados al usuario, pero la validación definitiva se realiza en el backend.

## UI y diseño

Se utiliza Material UI para construir la interfaz.

El proyecto cuenta con:

* Tema centralizado.
* Componentes reutilizables de Material UI.
* Diseño responsive.
* Estados de carga.
* Mensajes de error.
* Confirmaciones para operaciones destructivas.
* Navegación protegida.
* Dashboard con estadísticas de casos.

## Backend

El frontend consume una API REST desarrollada independientemente.

El backend utiliza:

* Node.js
* TypeScript
* Express
* Prisma
* PostgreSQL
* JWT
* Zod
* Cloudflare R2

La URL de la API se configura mediante:

```env
VITE_API_URL
```

## Ejecución en producción

El frontend está preparado para desplegarse en Vercel.

La variable de entorno requerida en producción es:

```env
VITE_API_URL=<URL_DE_LA_API>
```

### Producción

Frontend:

```text
<URL_DE_VERCEL>
```

Backend:

```text
<URL_DE_LA_API>
```

## Scripts

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Construir para producción:

```bash
npm run build
```

Previsualizar el build:

```bash
npm run preview
```

## Decisiones técnicas

### React + TypeScript

Se utiliza React para construir la interfaz y TypeScript para mejorar el tipado y reducir errores durante el desarrollo.

### Material UI

Se eligió Material UI para disponer de componentes consistentes y responsive, además de permitir construir rápidamente una interfaz clara para la prueba técnica.

### Servicios separados

Las llamadas al backend se mantienen fuera de las páginas mediante services para evitar acoplar la lógica HTTP con la interfaz.

### Manejo centralizado de errores

Se creó `apiRequest` como punto común para procesar las respuestas HTTP y `ApiError` para representar los errores de la API.

Esto permite mantener las páginas más simples y consistentes.

### URLs firmadas

Los archivos se transfieren directamente al almacenamiento mediante URLs firmadas para evitar utilizar el backend como intermediario del contenido binario.

### Vercel

Se utiliza Vercel para facilitar el despliegue del frontend y disponer de una URL pública para la evaluación.

## Uso de IA

Durante el desarrollo se utilizaron herramientas de inteligencia artificial como apoyo para:

* Generación inicial de estructuras y componentes.
* Revisión de código.
* Identificación de errores de TypeScript.
* Propuestas de organización del proyecto.
* Apoyo en manejo de errores.
* Revisión de flujos de autenticación.
* Documentación técnica.

### Código generado o apoyado por IA

La IA se utilizó principalmente como herramienta de apoyo para:

* Estructuras iniciales de componentes React.
* Services para consumo de la API.
* Manejo centralizado de errores.
* Configuración de componentes Material UI.
* Propuestas de arquitectura y organización.

### Código escrito o adaptado manualmente

El código fue revisado, adaptado y probado durante la implementación.

Se realizaron ajustes manuales principalmente en:

* Integración con la API real.
* Rutas y navegación.
* Flujo de autenticación.
* Manejo de estados.
* Flujo de carga y descarga de archivos.
* Compatibilidad con la versión utilizada de Material UI.
* Mensajes de error.
* Configuración del entorno.

### Error detectado durante el uso de IA

Durante la implementación se encontraron propuestas que no eran compatibles directamente con la versión de Material UI utilizada, especialmente en propiedades de algunos componentes.

Estas propuestas fueron revisadas y ajustadas utilizando las APIs compatibles con la versión instalada.

La IA se utilizó como herramienta de apoyo, pero las decisiones finales, integración y pruebas fueron realizadas sobre el proyecto ejecutable.

## Pruebas finales

Antes del despliegue se debe verificar:

* Registro de usuario.
* Login correcto.
* Login con credenciales incorrectas.
* Acceso a rutas privadas sin autenticación.
* Persistencia de sesión.
* Logout.
* Creación de casos.
* Listado de casos.
* Edición de casos.
* Cambio de estado.
* Eliminación de casos.
* Carga de archivos válidos.
* Rechazo de archivos inválidos.
* Descarga de evidencias.
* Manejo de errores del backend.
* Funcionamiento de la aplicación desplegada.

## Repositorio

```text
<URL_PUBLICA_DEL_REPOSITORIO>
```

## Demo

```text
<URL_DE_VERCEL>
```

## Credenciales de demostración

```text
Correo: <CORREO_DEMO>
Contraseña: <CONTRASEÑA_DEMO>
```
