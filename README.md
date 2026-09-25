# Gestor de Evidencias — Frontend
Pagina: https://gestor-evidencias-frontend.vercel.app/login

Aplicación web desarrollada con React y TypeScript para la gestión de casos y evidencias.

Este proyecto hace parte de una prueba técnica Full Stack y consume una API REST independiente encargada de la autenticación, autorización, persistencia de casos y gestión segura de archivos.

El frontend permite a los usuarios autenticarse, consultar y administrar sus casos, visualizar estadísticas y gestionar las evidencias asociadas.

---

# Tecnologías

* React
* TypeScript
* Vite
* Material UI (MUI)
* React Router
* Fetch API
* Vercel

---

# Arquitectura

El frontend está organizado separando las responsabilidades de las vistas, autenticación, navegación, consumo de API, tipos y componentes de interfaz.

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

La aplicación utiliza una estructura independiente para las páginas, servicios, autenticación, rutas y componentes visuales, permitiendo mantener separada la lógica de comunicación con el backend de la interfaz.

---

# Requisitos

* Node.js 20+
* npm
* Backend del proyecto disponible
* URL pública o local de la API

---

# Instalación

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd gestor-evidencias-frontend
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

Crear un archivo `.env` tomando como referencia `.env.example`.

```env
VITE_API_URL=
```

Esta variable corresponde a la URL base del backend.

Los valores reales de las variables de entorno no deben almacenarse en el repositorio.

---

# Ejecución

## Desarrollo

```bash
npm run dev
```

## Compilar

```bash
npm run build
```

## Previsualizar el build

```bash
npm run preview
```

---

# Integración con el Backend

El frontend consume una API REST independiente desarrollada con:

* Node.js
* TypeScript
* Express
* Prisma
* PostgreSQL
* Neon
* JWT
* Zod
* Cloudflare R2

La comunicación se centraliza mediante los servicios ubicados en:

```text
src/services/
```

La URL de la API se configura mediante:

```env
VITE_API_URL=
```

El frontend no contiene lógica de acceso directo a PostgreSQL, Neon o Cloudflare R2.

La persistencia y las reglas de negocio son responsabilidad del backend.

---

# Autenticación

La autenticación del frontend está integrada con el sistema JWT implementado en el backend.

El flujo principal es:

```text
Login
  ↓
Frontend envía credenciales
  ↓
Backend valida usuario
  ↓
Backend genera JWT
  ↓
Frontend almacena token
  ↓
Frontend consulta usuario autenticado
  ↓
AuthProvider mantiene la sesión
```

El token se almacena en `localStorage` y se utiliza para realizar las peticiones autenticadas.

Las solicitudes privadas incluyen:

```text
Authorization: Bearer <token>
```

## AuthProvider

La autenticación global se gestiona mediante React Context.

`AuthProvider` mantiene:

* Usuario autenticado.
* Token.
* Estado de carga.
* Inicio de sesión.
* Registro.
* Cierre de sesión.

Cuando la aplicación inicia, se verifica si existe un token almacenado y, si existe, se consulta el usuario autenticado mediante `/auth/me`.

Si el token ya no es válido, se elimina la sesión local y el usuario vuelve al estado no autenticado.

---

# Protección de rutas

Las rutas privadas se protegen mediante `ProtectedRoute`.

La estructura principal de navegación es:

```text
/login
/register

/dashboard
/cases
/cases/new
/cases/:id
/cases/:id/edit
```

Las rutas de gestión se encuentran dentro de una ruta protegida y requieren una sesión válida.

Además, `AppLayout` centraliza elementos compartidos como:

* Navbar.
* Contenedor principal.
* Fondo general de la aplicación.
* Estructura común de las páginas.

---

# Gestión de casos

El frontend implementa las operaciones necesarias para administrar los casos mediante la API.

Las funcionalidades incluyen:

* Crear casos.
* Listar casos.
* Consultar detalle.
* Editar casos.
* Cambiar estado.
* Eliminar casos.

Los estados utilizados son:

```text
OPEN
CLOSED
```

Cada operación utiliza los servicios definidos en:

```text
src/services/case.service.ts
```

La autorización sobre los recursos no se confía al frontend. El backend es quien valida que el usuario autenticado tenga permiso sobre el caso solicitado.

---

# Dashboard

El dashboard presenta información resumida de los casos del usuario.

Actualmente muestra:

* Total de casos.
* Casos abiertos.
* Casos cerrados.
* Casos con evidencia.

También proporciona accesos rápidos para:

* Crear un nuevo caso.
* Consultar los casos.

El dashboard consume los datos reales de la API y no utiliza información simulada.

---

# Gestión de evidencias

El frontend implementa la integración con el sistema de archivos basado en **Cloudflare R2**.

El proceso utiliza las URLs prefirmadas generadas por el backend.

El frontend realiza:

1. Solicitud de una URL de carga al backend.
2. Recepción de la URL prefirmada.
3. Carga directa del archivo hacia Cloudflare R2.
4. Confirmación de la carga al backend.
5. Consulta de una URL prefirmada para descargar el archivo.

El archivo no se envía directamente al servidor de la API.

Esto permite que el backend controle la autorización y validación mientras el contenido binario se transfiere directamente al almacenamiento.

## Tipos de archivo

La interfaz permite seleccionar los formatos soportados por el backend:

```text
image/jpeg
image/png
application/pdf
```

El límite de tamaño establecido es:

```text
5 MB
```

La validación definitiva permanece en el backend.

---

# Manejo de errores

El frontend implementa un sistema centralizado para interpretar los errores HTTP provenientes del backend.

Se creó:

```text
src/errors/api.error.ts
```

para representar los errores de la API.

Las solicitudes HTTP se centralizan mediante:

```text
src/services/api.service.ts
```

Esto permite que las diferentes páginas no tengan que implementar individualmente la lógica para interpretar las respuestas HTTP.

El flujo utilizado es:

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
Mensaje mostrado al usuario
```

Se manejan principalmente:

* `400` — Error de validación.
* `401` — No autenticado o token inválido.
* `403` — Operación no permitida.
* `404` — Recurso no encontrado.
* `409` — Conflicto.
* `500` — Error interno.

Cuando el backend proporciona un mensaje específico, el frontend lo utiliza para mostrar información más precisa al usuario.

---

# Estados de interfaz

Las páginas contemplan diferentes estados durante la interacción con la API:

* Carga.
* Éxito.
* Error.
* Información vacía.
* Operaciones en proceso.
* Confirmación de operaciones destructivas.

Esto se aplica principalmente a:

* Carga de casos.
* Creación.
* Edición.
* Eliminación.
* Carga de archivos.
* Descarga de archivos.
* Autenticación.

El objetivo es evitar que la interfaz quede en un estado indefinido mientras espera una respuesta del backend.

---

# Interfaz y componentes

La interfaz se desarrolló utilizando **Material UI (MUI)**.

Se utiliza para:

* Botones.
* Formularios.
* Campos de entrada.
* Cards.
* Alertas.
* Modales.
* Tablas.
* Menús.
* Navegación.
* Iconos.
* Indicadores de carga.
* Estados visuales.

También se creó un tema centralizado para mantener consistencia visual en toda la aplicación.

El tema define principalmente:

* Colores.
* Tipografía.
* Bordes.
* Botones.
* Cards.
* Fondo general.
* Estilos reutilizables.

La interfaz fue construida teniendo en cuenta diferentes tamaños de pantalla.

---

# Persistencia del token

El JWT se almacena en `localStorage` para mantener la sesión del usuario al recargar la aplicación.

Esta decisión simplifica la persistencia de sesión en el frontend, pero implica una consideración de seguridad: un token almacenado en `localStorage` puede quedar expuesto ante un ataque XSS.

Para una implementación de producción con mayores requisitos de seguridad podría utilizarse una cookie `httpOnly`, `Secure` y `SameSite`, evitando que JavaScript pueda acceder directamente al token.

---

# Control de versiones

El proyecto utiliza **Git** para el control de versiones y seguimiento de los cambios.

El desarrollo se realizó utilizando ramas independientes por funcionalidad y tomando `desarrollo` como rama base.

El flujo utilizado fue:

```text
desarrollo
    ↓
crear rama de funcionalidad
    ↓
desarrollo de la funcionalidad
    ↓
pruebas
    ↓
commit
    ↓
push de la rama
    ↓
merge hacia desarrollo
    ↓
actualización de desarrollo
```

Las ramas siguieron una estructura como:

```text
feature/nombre-funcionalidad
```

Cada funcionalidad se desarrolló de forma independiente para mantener los cambios aislados y facilitar su integración.

Una vez finalizada y validada una funcionalidad, se integraba nuevamente en `desarrollo`.

Al finalizar el desarrollo, se creó la rama `main` a partir de la versión estable de `desarrollo`, utilizándola como rama principal para el despliegue.

---

# Pruebas

El frontend fue validado mediante pruebas funcionales sobre la aplicación integrada con el backend real.

Se verificaron principalmente los siguientes escenarios:

* Registro.
* Inicio de sesión.
* Credenciales inválidas.
* Protección de rutas.
* Persistencia de sesión.
* Cierre de sesión.
* Consulta de usuario autenticado.
* Carga del dashboard.
* Creación de casos.
* Listado de casos.
* Consulta de detalle.
* Edición de casos.
* Cambio de estado.
* Eliminación de casos.
* Carga de archivos.
* Validación de archivos.
* Descarga de evidencias.
* Manejo de errores provenientes de la API.
* Estados de carga.
* Comportamiento de la interfaz en diferentes tamaños de pantalla.

No se utilizaron datos simulados para las funcionalidades principales. La aplicación consume el backend real.

---

# Decisiones técnicas

## React + TypeScript

React se utilizó para construir la interfaz y TypeScript para mantener tipado entre componentes, servicios y datos recibidos desde la API.

## Vite

Vite se utilizó como herramienta de construcción y desarrollo por su configuración sencilla y rápido ciclo de desarrollo.

## Material UI

Material UI se utilizó para construir la interfaz visual mediante componentes reutilizables.

Además, se creó un tema centralizado para mantener una apariencia consistente en toda la aplicación.

## React Context

React Context se utilizó para manejar el estado global de autenticación y evitar pasar manualmente la información del usuario y token entre múltiples componentes.

## React Router

React Router se utiliza para gestionar la navegación y separar las rutas públicas de las privadas.

## Services

Las peticiones HTTP se mantienen en services independientes de las páginas.

Esto permite separar:

```text
Interfaz
   ↓
Service
   ↓
API
```

y evita colocar directamente la lógica de comunicación HTTP dentro de los componentes visuales.

## Manejo centralizado de errores

Se implementó `apiRequest` como punto común para las peticiones HTTP y `ApiError` para representar los errores recibidos desde el backend.

Esto permite mantener un comportamiento consistente en las diferentes páginas.

## URLs prefirmadas

Para las evidencias se mantiene el mismo modelo implementado por el backend:

```text
Frontend
   ↓
Solicita URL
   ↓
Backend valida autorización
   ↓
URL prefirmada
   ↓
Cloudflare R2
```

El frontend no necesita conocer ni manejar las credenciales de Cloudflare R2.

---

# Despliegue

El frontend está preparado para desplegarse en **Vercel**.

La rama utilizada para producción es:

```text
main
```

La variable de entorno requerida es:

```env
VITE_API_URL=<URL_DEL_BACKEND>
```

El frontend se conecta al backend desplegado como un servicio independiente.

Arquitectura de producción:

```text
Usuario
   ↓
Vercel
   ↓
React + Vite
   ↓
Backend API
   ↓
Neon + Cloudflare R2
```
---

# Uso de Inteligencia Artificial

Durante el desarrollo se utilizó **ChatGPT** como herramienta de apoyo técnico.

## Uso realizado

ChatGPT fue utilizado principalmente para apoyar la construcción de la interfaz y la implementación de componentes.

Entre los usos realizados se encuentran:

* Propuestas para la estructura visual de las páginas.
* Diseño de componentes con Material UI.
* Creación de formularios.
* Propuestas para el Dashboard.
* Diseño de la navegación.
* Propuestas de estilos y distribución de elementos.
* Implementación de estados visuales.
* Apoyo en la integración de componentes.
* Revisión de errores de TypeScript relacionados con Material UI.
* Apoyo en el manejo de errores de la API.
* Revisión de la integración entre frontend y backend.
* Documentación final

La IA tuvo un papel especialmente importante en la construcción de la parte visual, ayudando a generar y proponer componentes de Material UI y diferentes estructuras para las páginas.

## Incidentes y correcciones

Durante el desarrollo se presentaron algunos casos en los que las propuestas generadas por ChatGPT no coincidían exactamente con la versión de Material UI utilizada en el proyecto.

Algunas propiedades o componentes propuestos requerían ajustes para ser compatibles con las versiones instaladas.

Estos problemas fueron identificados durante la compilación y ejecución de la aplicación y fueron **corregidos manualmente**, adaptando las propuestas a la API real de las dependencias utilizadas.

También se realizaron ajustes manuales sobre las propuestas visuales para adaptarlas a la estructura final de la aplicación, los requisitos de la prueba técnica y la integración con el backend.

La IA se utilizó como herramienta de apoyo, mientras que la implementación final, integración, ejecución y validación fueron realizadas manualmente sobre el proyecto.
