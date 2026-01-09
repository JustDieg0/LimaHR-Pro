# LimaHR-Pro

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.20.0-brightgreen)](https://nodejs.org/)
[![Angular Version](https://img.shields.io/badge/angular-%5E20.3.6-red)](https://angular.io/)

> Un pequeño proyecto full stack para la gestión de recursos humanos


## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Scripts Disponibles](#-scripts-disponibles)

## ✨ Características

- 🔄 CRUD completo de recursos
- 🎨 Componentes UI modernos con PrimeNG
- 📄 Paginación de datos
- ⚡ API RESTful con Express y TypeScript
- 🗄️ Base de datos MySQL optimizada

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Angular 20+
- **Estilos:** Tailwind CSS 4.1
- **Componentes UI:** PrimeNG 20+
- **Lenguaje:** TypeScript 5.9
- **HTTP Client:** Angular HttpClient
- **Routing:** Angular Router

### Backend
- **Runtime:** Node.js 22+
- **Framework:** Express.js 5.2
- **Lenguaje:** TypeScript 5.9
- **Validación:** express-validator
- **Variables de Entorno:** dotenv

### Base de Datos
- **DBMS:** MySQL 8.0+
- **Cliente:** mysql2

### Herramientas de Desarrollo
- **Control de Versiones:** Git

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v22.20.0 o superior)
- [npm](https://www.npmjs.com/) (v10.9.3 o superior)
- [MySQL](https://www.mysql.com/) (v8.0 o superior)
- [Angular CLI](https://angular.io/cli) (v20.0.0 o superior)
- [Git](https://git-scm.com/)

```bash
# Verificar versiones instaladas
node --version
npm --version
ng version
mysql --version
```

## 🚀 Instalación
**1. Clonar el repositorio**

```
git clone https://github.com/tu-usuario/nombre-proyecto.git
cd nombre-proyecto
```
**2. Instalar dependencias del Backend**
```
cd backend
npm install

```
**3. Instalar dependencias del Frontend**
```
cd ../frontend
npm install
```
**4. Configurar Base de Datos**
```
CREATE DATABASE limahr_pro_db
USE limahr_pro_db

-- Tabla Departamentos
CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    jefe_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Empleados
CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(9),
    departamento_id INT,
    salario DECIMAL(10,2),
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE
);

ALTER TABLE departamentos ADD FOREIGN KEY (jefe_id) REFERENCES empleados(id);
ALTER TABLE empleados ADD FOREIGN KEY (departamento_id) REFERENCES departamentos(id);
```
### ⚙️ Configuración

**Backend - Variables de Entorno**

Crear archivo `.env` en la carpeta `backend/`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=limahr_pro_db
DB_PORT= 3006

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200
```
**Frontend - Configuración de Ambiente**

Editar `frontend/src/app/environments/environment.ts`:
```
export const environment = {
    apiUrl: 'http://localhost:4000/api/v1'
}
```
### 📁 Estructura del Proyecto
```
limahr_pro/
├── backend/ # API REST (Node.js + TypeScript)
│ ├── .env # Variables de entorno
│ ├── package.json # Dependencias del backend
│ ├── tsconfig.json # Configuración de TypeScript
│ └── src/
│ ├── index.ts # Punto de entrada
│ ├── departamento/ # Módulo de departamentos
│ ├── empleado/ # Módulo de empleados
│ ├── interfaces/
│ │ └── interfaces.ts # Interfaces compartidas
│ ├── lib/ # Librerías reutilizables
│ ├── routes/ # Rutas API
│ └── utils/ # Utilidades
│
└── frontend/ # Aplicación Angular (SSR)
├── .editorconfig # Configuración del editor
├── .gitignore
├── angular.json # Configuración de Angular
├── package.json # Dependencias del frontend
├── tsconfig.json # Configuración base TypeScript
├── tsconfig.app.json # Config TypeScript para app
├── tsconfig.spec.json # Config TypeScript para tests
├── README.md
├── .angular/
│ └── cache/ # Caché de Angular CLI
├── .vscode/
│ ├── extensions.json # Extensiones recomendadas
│ ├── launch.json # Configuración debug
│ └── tasks.json # Tareas personalizadas
├── public/ # Archivos estáticos
└── src/
├── index.html # HTML principal
├── main.ts # Bootstrap de Angular
├── main.server.ts # Bootstrap SSR
├── server.ts # Servidor Node.js
├── styles.css # Estilos globales
└── app/
├── pages/
│ ├── departamentos/
│ │ ├── form/
│ │ │ ├── form.ts # [Componente formulario]
│ │ │ └── form.html # [Template formulario]
│ │ └── list/
│ │ └── list.ts # [Componente listado]
│ └── empleados/
│ ├── form/
│ │ ├── form.ts # [Componente formulario]
│ │ └── form.html # [Template formulario]
│ └── list/
│ └── list.ts # [Componente listado]
├── models/
│ ├── departamento.model.ts
│ └── empleado.model.ts
├── services/
│ ├── departamentos.services.ts
│ └── empleados.services.ts
└── (rutas y componentes principales)

```
### 🔌 API Endpoints
📊 Resumen de Endpoints
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/departamentos` | Crear departamento |
| GET | `/api/v1/departamentos` | Listar departamentos |
| GET | `/api/v1/departamentos/:id` | Obtener departamento |
| PUT | `/api/v1/departamentos/:id` | Actualizar departamento |
| DELETE | `/api/v1/departamentos/:id` | Eliminar departamento |
| POST | `/api/v1/empleados` | Crear empleado |
| GET | `/api/v1/empleados` | Listar empleados |
| GET | `/api/v1/empleados/:id` | Obtener empleado |
| PUT | `/api/v1/empleados/:id` | Actualizar empleado |
| DELETE | `/api/v1/empleados/:id` | Eliminar empleado |

### Ejemplo de Request/Response
**POST /api/v1/empleado**

Request:
```
{
  "nombre": "Test Empleado GitHub",
  "email": "git@example.com",
  "contrasena": "TestTest50.",
  "telefono": "123456789",
  "departamento_id": null,
  "salario": 1201.00
}
```
Response:
```
{
  "status": "success",
  "message": "Empleado creado exitosamente",
  "data": {
    "id": 3,
    "nombre": "Test Empleado GitHub",
    "email": "git@example.com",
    "contrasena": "TestTest50.",
    "telefono": "123456789",
    "departamento_id": null,
    "salario": "1201.00",
    "fecha_ingreso": null,
    "activo": 1
  }
}
```
### 📜 Scripts Disponibles
**Backend**
```
npm run dev          # Iniciar servidor en modo desarrollo con hot-reload
```
**Frontend**
```
npm start            # Iniciar app en desarrollo (http://localhost:4200)
npm run build        # Build de producción
npm test             # Ejecutar tests
npm watch            # Observar los cambios en tiempo real
```
