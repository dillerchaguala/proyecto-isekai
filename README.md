# Isekai App

¡Bienvenido a Isekai App! Este proyecto es una plataforma integral para el bienestar emocional, con frontend en React + Vite y backend en Node.js + Express + MongoDB.

---

## 🖥️ Frontend (React + Vite)

- Landing page pública con diseño moderno y responsivo.
- Registro, inicio de sesión y panel de usuario.
- Panel de administración con gestión CRUD para usuarios, terapias, logros y desafíos.
- Navegación protegida por roles y sesión.
- Integración con backend vía API REST.

## ⚙️ Backend (Node.js + Express + MongoDB)

- API RESTful con autenticación JWT y roles.
- Gestión de usuarios, terapias, logros, desafíos y estados de ánimo.
- Sistema de XP, niveles y gamificación.
- Registro de actividades y seguimiento emocional.

---

## 🚀 Instalación rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/dillerchaguala/proyecto-isekai.git
   ```
2. Instala dependencias en ambos folders:
   ```bash
   cd proyecto-isekai/backend-isekai
   npm install
   cd ../frontend-isekai
   npm install
   ```
3. Configura las variables de entorno en `backend-isekai/.env` (ver ejemplo en README del backend).
4. Inicia el backend:
   ```bash
   npm start
   ```
5. Inicia el frontend:
   ```bash
   npm run dev
   ```

---

## 📁 Estructura del proyecto

- `backend-isekai/` - API y lógica de negocio.
- `frontend-isekai/` - Interfaz de usuario y landing page.

---

## 📚 Documentación

- Consulta la documentación de la API en `backend-isekai/docs/Api_docum.md`.
- Para detalles de endpoints y modelos, revisa los archivos en `backend-isekai/controllers/` y `backend-isekai/models/`.

---

## 👨‍💻 Autor

- Diller Chaguala

---

## 📝 Licencia

Este proyecto es de uso académico y personal. Para uso comercial, contactar al autor.

---

## 🤝 Contribución

¿Quieres aportar al proyecto? ¡Bienvenido! Puedes crear un fork, trabajar en la rama `develop` y enviar tu pull request. Por favor, sigue las buenas prácticas:

- Usa ramas descriptivas para tus features o fixes.
- Escribe mensajes de commit claros y concisos.
- Documenta tus cambios en el README o en los archivos relevantes.
- Si agregas endpoints, actualiza la documentación en `backend-isekai/docs/Api_docum.md`.

---

## 📬 Contacto profesional

Para soporte, sugerencias o colaboraciones:

- Email: contacto@isekai.com
- LinkedIn: [Diller Chaguala](https://www.linkedin.com/in/dillerchaguala)
