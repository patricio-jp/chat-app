# 💬 Sala Chat

Una aplicación web de chat simple desarrollada con HTML, JavaScript y TailwindCSS. Permite a los usuarios registrarse, iniciar sesión y enviar mensajes dentro de una sala de chat básica (sin backend, usando `localStorage`).

## 📁 Estructura del proyecto

- `index.html` – Página de inicio
- `login.html` – Inicio de sesión
- `registro.html` – Registro de usuarios
- `recuperacionEmail.html` – Simulación de recuperación de contraseña
- `chat.html` – Sala de chat principal
- `login.js`, `registro.js`, `recuperacionEmail.js`, `chat.js` – Scripts funcionales
- `README.md` – Descripción del proyecto

## 🚀 Características

- Registro e inicio de sesión de usuario
- Validación de credenciales simples
- Chat local (solo en el navegador del usuario)
- Recuperación de contraseña (simulada)
- Interfaz moderna con TailwindCSS

## 🛠 Tecnologías utilizadas

- HTML5
- JavaScript
- TailwindCSS (vía CDN)
- `localStorage` para almacenamiento de usuarios y mensajes

## 📝 Instrucciones de uso

1. Cloná este repositorio o descargalo como `.zip`
2. Abrí `index.html` en tu navegador
3. Registrate como nuevo usuario
4. Iniciá sesión
5. Accedé a la sala de chat
6. ¡Listo! Podés chatear localmente en tu navegador

## ⚠️ Limitaciones

- No hay conexión entre usuarios reales (sin backend ni sockets)
- Todo se guarda solo en `localStorage`, por lo que es local y temporal

## 📦 Futuras mejoras (ideas)

- Implementar backend con Node.js y WebSocket
- Conexión en tiempo real
- Base de datos para usuarios y mensajes
- Sistema de notificaciones
- Autenticación más segura

## 🧑 Autor

- Proyecto realizado por Jao