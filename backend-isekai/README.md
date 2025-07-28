# Isekai App - Backend

¡Bienvenido al backend de Isekai App! Este repositorio contiene la API RESTful que impulsa la aplicación de bienestar Isekai, gestionando usuarios, terapias, logros, desafíos y el sistema de gamificación.

---

## 🚀 Características Principales

* **Autenticación de Usuarios:** Registro, inicio de sesión y gestión de tokens JWT.
* **Roles de Usuario:** Diferenciación entre roles (Paciente, Profesional, Admin).
* **Gestión de Terapias:** Creación, edición, eliminación y acceso a terapias.
* **Completar Tareas/Terapias:** Registro de finalización de terapias por parte de los pacientes.
* **Sistema de Logros:** Desbloqueo automático de hitos permanentes basados en el progreso del usuario.
* **Sistema de Desafíos:** Asignación de tareas recurrentes o únicas con recompensas de XP, incluyendo:
    * `terapiasCompletadas`: Por completar un número de terapias.
    * `xpGanado`: Por acumular una cantidad de XP.
    * `registrosAnimo`: Por registrar el estado de ánimo (funcionalidad implementada recientemente).
    * `meditacionMinutos` (listo para implementar el tracking): Para desafíos basados en la duración de la meditación.
* **Gestión de XP y Nivel:** Seguimiento de puntos de experiencia y nivel del usuario.
* **Registro de Estado de Ánimo:** Los usuarios pueden registrar su estado de ánimo diario/semanal.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js:** Entorno de ejecución JavaScript.
* **Express.js:** Framework web para Node.js.
* **MongoDB:** Base de datos NoSQL.
* **Mongoose:** ODM (Object Data Modeling) para MongoDB en Node.js.
* **JSON Web Tokens (JWT):** Para autenticación segura.
* **Bcrypt:** Para hash de contraseñas.
* **Dotenv:** Para gestión de variables de entorno.

---

## ⚙️ Configuración y Ejecución

Sigue estos pasos para poner en marcha el backend en tu entorno local.

### Prerrequisitos

* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* [MongoDB](https://www.mongodb.com/try/download/community) (instala el servidor MongoDB y asegúrate de que esté ejecutándose)

### Instalación

1.  Clona el repositorio (o navega a la carpeta de tu backend si ya existe):
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd isekai-app-backend # O el nombre de tu carpeta backend
    ```
2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

### Variables de Entorno

Crea un archivo `.env` en la raíz de tu carpeta del backend con las siguientes variables:

NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/isekai_db
JWT_SECRET=tuSuperSecretoJWT # ¡Cambia esto por una cadena larga y aleatoria!
JWT_EXPIRE=30d # Por ejemplo, 30 días


### Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
El servidor estará disponible en http://localhost:5000 (o el puerto que hayas configurado).

📊 Estructura del Proyecto
isekai-app-backend/
├── config/             # Configuración de la base de datos
│   └── db.js
├── controllers/        # Lógica de negocio para cada ruta (CRUD, gamificación)
│   ├── authController.js
│   ├── desafioController.js
│   ├── estadoAnimoController.js
│   ├── logroController.js
│   ├── terapiaController.js
│   ├── tareaController.js
│   └── userController.js
├── middleware/         # Middleware de Express (autenticación, autorización)
│   └── authMiddleware.js
├── models/             # Esquemas de Mongoose para la base de datos
│   ├── Desafio.js
│   ├── EstadoAnimo.js
│   ├── Logro.js
│   ├── Tarea.js
│   ├── Terapia.js
│   └── User.js
├── routes/             # Rutas de la API (endpoints)
│   ├── auth.js
│   ├── desafios.js
│   ├── estadoAnimo.js
│   ├── logros.js
│   ├── tareas.js
│   ├── terapias.js
│   └── users.js
├── .env                # Variables de entorno (NO subir a Git)
├── .gitignore          # Archivos y carpetas a ignorar por Git
├── package.json        # Metadatos del proyecto y dependencias
├── server.js           # Punto de entrada de la aplicación
└── README.md           # Este archivo
📝 Documentación de la API (Básica)
Para una documentación más detallada de los endpoints, consulta el archivo docs/API_DOCUMENTATION.md.

🤝 Contribución
¡Las contribuciones son bienvenidas! Si deseas contribuir, por favor, sigue el flujo de trabajo estándar de GitHub (fork, branch, pull request).

📄 Licencia
Este proyecto está licenciado bajo la Licencia MIT.