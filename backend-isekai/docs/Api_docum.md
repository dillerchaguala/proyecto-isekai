```markdown
# Isekai App - Documentación de API

Este documento detalla los endpoints principales de la API del backend de Isekai App.

---

## Autenticación

### `POST /api/auth/register`
* **Descripción:** Registra un nuevo usuario.
* **Acceso:** Público.
* **Request Body:**
    ```json
    {
      "nombreUsuario": "nuevoUsuario",
      "email": "nuevo@example.com",
      "contrasena": "password123",
      "rol": "Paciente" // O "Profesional", "Admin"
    }
    ```
* **Response (201 Created):**
    ```json
    {
      "message": "Usuario registrado y sesión iniciada",
      "token": "eyJhbGciOiJIUzI1Ni...",
      "usuario": {
        "_id": "...",
        "nombreUsuario": "...",
        "email": "...",
        "rol": "...",
        "puntosExperiencia": 0,
        "nivelActual": 1
      }
    }
    ```
* **Response (400 Bad Request):** `{ "message": "El nombre de usuario o email ya existen" }`

---

### `POST /api/auth/login`
* **Descripción:** Inicia sesión con un usuario existente.
* **Acceso:** Público.
* **Request Body:**
    ```json
    {
      "nombreUsuario": "usuarioExistente",
      "contrasena": "password123"
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "message": "Inicio de sesión exitoso",
      "token": "eyJhbGciOiJIUzI1Ni...",
      "usuario": {
        "_id": "...",
        "nombreUsuario": "...",
        "email": "...",
        "rol": "...",
        "puntosExperiencia": "...",
        "nivelActual": "..."
      }
    }
    ```
* **Response (401 Unauthorized):** `{ "message": "Credenciales inválidas" }`

---

## Usuarios

### `GET /api/users/profile`
* **Descripción:** Obtiene el perfil del usuario autenticado.
* **Acceso:** Privado (todos los roles).
* **Headers:** `Authorization: Bearer <token_jwt>`
* **Response (200 OK):** Objeto `User` completo con `terapiasCompletadas`, `logrosCompletados`, `desafiosCompletados` (IDs poblados).

---

### `GET /api/users/:id` (Solo para Admin)
* **Descripción:** Obtiene el perfil de un usuario específico por ID.
* **Acceso:** Privado (Admin).
* **Headers:** `Authorization: Bearer <token_jwt_admin>`
* **Response (200 OK):** Objeto `User` completo.

---

## Terapias y Tareas

### `POST /api/terapias`
* **Descripción:** Crea una nueva terapia.
* **Acceso:** Privado (Admin).
* **Headers:** `Authorization: Bearer <token_jwt_admin>`
* **Request Body:**
    ```json
    {
      "titulo": "Meditación Guiada para el Estrés",
      "descripcion": "Una terapia para reducir el estrés en 15 minutos.",
      "xpRecompensa": 50,
      "duracionEstimada": 15,
      "categoria": "Mindfulness"
    }
    ```
* **Response (201 Created):** Objeto `Terapia` creada.

---

### `GET /api/terapias`
* **Descripción:** Obtiene todas las terapias disponibles.
* **Acceso:** Privado (todos los roles autenticados).
* **Headers:** `Authorization: Bearer <token_jwt>`
* **Response (200 OK):** Array de objetos `Terapia`.

---

### `POST /api/tareas/completar`
* **Descripción:** Marca una terapia como completada por el usuario autenticado. Esto dispara la lógica de gamificación (XP, Logros, Desafíos).
* **Acceso:** Privado (Paciente).
* **Headers:** `Authorization: Bearer <token_jwt_paciente>`
* **Request Body:**
    ```json
    {
      "terapiaId": "ID_DE_LA_TERAPIA_COMPLETADA"
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "message": "Tarea completada exitosamente",
      "terapiaCompletada": { ... },
      "usuarioActualizado": { ... } // Incluye XP y niveles actualizados
    }
    ```

---

## Logros

### `POST /api/logros`
* **Descripción:** Crea un nuevo logro.
* **Acceso:** Privado (Admin).
* **Headers:** `Authorization: Bearer <token_jwt_admin>`
* **Request Body:**
    ```json
    {
      "nombre": "Primeros Pasos",
      "descripcion": "Completa tu primera terapia.",
      "criterio": "terapiasCompletadas",
      "valor": 1,
      "recompensaXP": 100
    }
    ```
    * **`criterio` puede ser:** `terapiasCompletadas`, `nivelAlcanzado`, `xpAcumulado`.
* **Response (201 Created):** Objeto `Logro` creado.

---

### `GET /api/logros`
* **Descripción:** Obtiene todos los logros definidos en el sistema.
* **Acceso:** Privado (todos los roles autenticados).
* **Headers:** `Authorization: Bearer <token_jwt>`
* **Response (200 OK):** Array de objetos `Logro`.

---

## Desafíos

### `POST /api/desafios`
* **Descripción:** Crea un nuevo desafío.
* **Acceso:** Privado (Admin).
* **Headers:** `Authorization: Bearer <token_jwt_admin>`
* **Request Body:**
    ```json
    {
      "nombre": "Meditación Diaria",
      "descripcion": "Completa 10 minutos de meditación hoy.",
      "tipo": "meditacionMinutos",
      "valorRequerido": 10,
      "recompensaXP": 30,
      "frecuencia": "diario" // O "semanal", "unico"
    }
    ```
    * **`tipo` puede ser:** `terapiasCompletadas`, `xpGanado`, `registrosAnimo`, `meditacionMinutos`.
* **Response (201 Created):** Objeto `Desafio` creado.

---

### `GET /api/desafios`
* **Descripción:** Obtiene todos los desafíos definidos en el sistema.
* **Acceso:** Privado (todos los roles autenticados).
* **Headers:** `Authorization: Bearer <token_jwt>`
* **Response (200 OK):** Array de objetos `Desafio`.

---

## Estado de Ánimo

### `POST /api/estado-animo`
* **Descripción:** Permite a un usuario registrar su estado de ánimo. Esto puede disparar desafíos de tipo `registrosAnimo`.
* **Acceso:** Privado (Paciente).
* **Headers:** `Authorization: Bearer <token_jwt_paciente>`
* **Request Body:**
    ```json
    {
      "estado": "Bien", // Valores permitidos: 'Excelente', 'Bien', 'Neutral', 'Mal', 'Muy Mal'
      "notas": "Hoy me siento productivo."
    }
    ```
* **Response (201 Created):** Objeto `EstadoAnimo` registrado.

---

### `GET /api/estado-animo`
* **Descripción:** Obtiene el historial de registros de estado de ánimo del usuario autenticado.
* **Acceso:** Privado (Paciente).
* **Headers:** `Authorization: Bearer <token_jwt_paciente>`
* **Response (200 OK):** Array de objetos `EstadoAnimo`, ordenados por fecha descendente.

---