# Sistema de Gestión de Incidentes - Help Desk

## Descripción

Este proyecto corresponde al desarrollo de un Sistema de Gestión de Incidentes (Help Desk), realizado como práctica académica para la asignatura de Tecnologías de la Información.

El sistema permite registrar, consultar, actualizar y eliminar tickets de soporte mediante una API REST desarrollada con Node.js, Express y MongoDB. Además, cuenta con una interfaz web desarrollada con HTML, CSS y JavaScript.

---

## Tecnologías utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Dotenv

### Herramientas

- Visual Studio Code
- Git
- GitHub
- Thunder Client

---

## Estructura del proyecto
Maquetación Estructural del Help Desk/

│
├── assets/
│ ├── css/
│ │ └── style.css
│ └── img/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── package.json
│ ├── package-lock.json
│ ├── .env
│ └── .gitignore
│
├── index.html
├── reportar.html
├── tickets.html
└── README.md
---

## Funcionalidades

- Registrar incidentes.
- Consultar todos los tickets.
- Buscar un ticket por ID.
- Actualizar información de un ticket.
- Eliminar tickets.
- Comunicación mediante API REST.
- Base de datos MongoDB.

---

## Ramas utilizadas en Git

El proyecto fue organizado mediante Git utilizando las siguientes ramas:

- main
- develop
- feature/maquetacion-html
- feature/responsive-layout
- feature/backend-api

---

## Backend

El backend se encuentra desarrollado dentro de la carpeta:
backend/


Cuenta con una estructura organizada:

- config: configuración de la conexión con MongoDB.
- controllers: lógica de los procesos del sistema.
- models: modelos de datos.
- routes: rutas de la API.
- server.js: archivo principal del servidor.

---

## API REST

Endpoints principales:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/tickets | Obtener tickets |
| GET | /api/tickets/:id | Buscar ticket por ID |
| POST | /api/tickets | Crear ticket |
| PUT | /api/tickets/:id | Actualizar ticket |
| DELETE | /api/tickets/:id | Eliminar ticket |

---

## Pruebas realizadas

La API fue probada mediante Thunder Client verificando el funcionamiento de las operaciones CRUD:

- Creación de tickets.
- Consulta de tickets.
- Actualización de información.
- Eliminación de registros.

---

## Autor

**Jairo Arias**

Universidad Técnica de Manabí

Tecnologías de la Información

2026