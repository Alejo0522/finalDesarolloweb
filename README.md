# Final: Sistema de Reseñas de Restaurantes

Este repositorio contiene la entrega final del proyecto para la gestión de reseñas de restaurantes, desarrollado con el stack MEAN (MongoDB, Express, Angular, Node.js).

## Integrantes del equipo:
- Jose Alejandro Arrubla Ortega
- Jean Pierr Suaza Novoa
- Samuel Munera Naranjo

## Características implementadas:
- **Frontend (Angular)**: Interfaz de usuario "Glassmorphism" con autenticación y dashboard.
- **Backend (Node.js & Express)**: API RESTful protegida con JWT.
- **Base de Datos (MongoDB)**: Modelado de usuarios y reseñas (1 a N).
- **Regla de negocio estricta**: Los usuarios solo pueden editar o eliminar sus propias reseñas, pero pueden leer las de toda la comunidad.

## Instrucciones para ejecutar:

### 1. Backend
\`\`\`bash
cd backend
npm install
npm run dev


- Se debe crear el archivo .env en la carpeta raiz del backend manualmente para hacer la cconexion con mongo db. Ejemplo de fragmento de codigo que debe ir:
(PORT=3000
MONGODB_URI=mongodb://localhost:27017/restaurantesDB
JWT_SECRET=mi_super_clave_secreta_super_segura_123)
\`\`\`

### 2. Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`
