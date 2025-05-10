# 💬 Sala Chat

Una aplicación web de chat simple desarrollada con HTML, JavaScript, TailwindCSS, y próximamente backend y base de datos. Actualmente permite a los usuarios registrarse, iniciar sesión y enviar mensajes dentro de una sala de chat local usando `localStorage`.

## 📁 Estructura del proyecto

- `index.html` – Página de inicio
- `login.html` – Inicio de sesión
- `registro.html` – Registro de usuarios
- `recuperacionEmail.html` – Recuperación de contraseña (simulada)
- `chat.html` – Sala de chat principal
- `js/` – Scripts funcionales (`login.js`, `registro.js`, `recuperacionEmail.js`, `chat.js`)
- `README.md` – Descripción del proyecto

## 🚀 Características actuales

- Registro e inicio de sesión de usuario
- Validación de credenciales simples
- Chat local (solo en el navegador del usuario)
- Recuperación de contraseña simulada
- Interfaz moderna con TailwindCSS

## 🛠 Tecnologías utilizadas

- HTML5
- JavaScript
- TailwindCSS (vía CDN)
- `localStorage` (versión actual)
- 🔜 Node.js (backend en desarrollo)
- 🔜 Base de datos (MongoDB / PostgreSQL en desarrollo)

## 📝 Instrucciones de uso

1. Cloná este repositorio o descargalo como `.zip`
2. Abrí `index.html` en tu navegador
3. Registrate como nuevo usuario
4. Iniciá sesión
5. Accedé a la sala de chat
6. ¡Listo! Podés chatear localmente en tu navegador

## ⚠️ Limitaciones actuales

- Sin conexión entre usuarios reales (sin backend ni sockets todavía)
- Todo se guarda solo en `localStorage` (local y temporal)

## 📦 Futuras mejoras (en desarrollo)

- Backend con Node.js y WebSocket
- Conexión en tiempo real entre usuarios
- Base de datos para persistencia de usuarios y mensajes
- Autenticación más segura con hashing (bcrypt / JWT)
- Sistema de notificaciones
- Diseño responsivo avanzado
