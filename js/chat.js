const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("chat-messages");
const onlineUsers = document.getElementById("online-users");
const userSpan = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");

// Obtener el usuario actual desde localStorage
const usuario = localStorage.getItem("username");

// Verificar si hay un usuario registrado
if (!usuario) {
    // Si no hay usuario, redirigir a login
    window.location.href = "login.html";
} else {
    // Mostrar nombre del usuario en la interfaz
    userSpan.textContent = usuario;

    // Obtener y actualizar la lista de usuarios en línea
    let usuariosEnLinea = JSON.parse(localStorage.getItem("usuariosEnLinea")) || [];
    if (!usuariosEnLinea.includes(usuario)) {
        usuariosEnLinea.push(usuario);
        localStorage.setItem("usuariosEnLinea", JSON.stringify(usuariosEnLinea));
    }

    // Mostrar usuarios en línea
    mostrarUsuariosEnLinea();

    // Si hay un receptor activo, mostrar el chat con ese usuario
    const receptorActivo = localStorage.getItem("receptorActivo");
    if (receptorActivo) {
        mostrarMensajesCon(receptorActivo);
    }
}

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
    // Eliminar el usuario de la lista de usuarios en línea
    let usuariosEnLinea = JSON.parse(localStorage.getItem("usuariosEnLinea")) || [];
    usuariosEnLinea = usuariosEnLinea.filter((user) => user !== usuario);
    localStorage.setItem("usuariosEnLinea", JSON.stringify(usuariosEnLinea));

    // Limpiar los datos del usuario y redirigir al login
    localStorage.removeItem("username");
    localStorage.removeItem("receptorActivo");
    window.location.href = "login.html";
});

// Mostrar la lista de usuarios en línea y permitir seleccionar para chatear
function mostrarUsuariosEnLinea() {
    let usuariosEnLinea = JSON.parse(localStorage.getItem("usuariosEnLinea")) || [];
    const receptorActivo = localStorage.getItem("receptorActivo");

    onlineUsers.innerHTML = ""; // Limpiar lista de usuarios

    usuariosEnLinea.forEach((user) => {
        if (user !== usuario) {
            const userItem = document.createElement("li");
            userItem.className =
                "p-2 bg-gray-100 rounded mb-1 cursor-pointer hover:bg-blue-200";
            userItem.textContent = user;

            // Resaltar al usuario con el que estamos chateando
            if (user === receptorActivo) {
                userItem.classList.add("bg-blue-300", "font-semibold", "animate-bounce");
            }

            userItem.addEventListener("click", () => {
                localStorage.setItem("receptorActivo", user);
                mostrarMensajesCon(user);
                mostrarUsuariosEnLinea(); // Volver a actualizar la lista de usuarios
            });

            onlineUsers.appendChild(userItem);
        }
    });
}

// Mostrar los mensajes con el receptor seleccionado
function mostrarMensajesCon(receptor) {
    messages.innerHTML = ""; // Limpiar mensajes previos

    // Mostrar título del chat con el receptor
    const tituloExistente = document.getElementById("chat-title");
    if (tituloExistente) {
        tituloExistente.remove();
    }

    const titulo = document.createElement("h2");
    titulo.id = "chat-title";
    titulo.className = "text-lg font-semibold mb-3";
    titulo.textContent = `Chateando con: ${receptor}`;
    messages.appendChild(titulo);

    // Filtrar mensajes del historial de chat
    const historial = JSON.parse(localStorage.getItem("mensajesChat")) || [];
    const conversacion = historial.filter(
        (m) =>
            (m.emisor === usuario && m.receptor === receptor) ||
            (m.emisor === receptor && m.receptor === usuario)
    );

    // Mostrar los mensajes de la conversación
    conversacion.forEach((mensaje) => {
        const messageContainer = document.createElement("div");
        messageContainer.className = "flex mb-2";

        const msg = document.createElement("div");
        msg.className = "p-2 rounded max-w-xs break-words";
        const hora = new Date(mensaje.hora || new Date());
        const horas = hora.getHours().toString().padStart(2, "0");
        const minutos = hora.getMinutes().toString().padStart(2, "0");
        const horaFormateada = `${horas}:${minutos}`;

        msg.textContent = `${mensaje.texto}  ${horaFormateada}`;

        if (mensaje.emisor === usuario) {
            messageContainer.classList.add("justify-end");
            msg.classList.add("bg-blue-200", "text-right");
        } else {
            messageContainer.classList.add("justify-start");
            msg.classList.add("bg-green-200", "text-left");
        }

        messageContainer.appendChild(msg);
        messages.appendChild(messageContainer);
    });

    messages.scrollTop = messages.scrollHeight;
}

// Enviar un mensaje
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = input.value.trim();
    const receptor = localStorage.getItem("receptorActivo");

    if (text !== "" && receptor) {
        const mensaje = {
            emisor: usuario,
            receptor: receptor,
            texto: text,
            hora: new Date().toISOString(),
        };

        // Guardar el nuevo mensaje en el historial
        let historial = JSON.parse(localStorage.getItem("mensajesChat")) || [];
        historial.push(mensaje);
        localStorage.setItem("mensajesChat", JSON.stringify(historial));

        mostrarMensajesCon(receptor); // Mostrar el mensaje recién agregado
        input.value = ""; // Limpiar el campo de entrada
        messages.scrollTop = messages.scrollHeight;
    }
});

// Eliminar usuario de la lista de usuarios en línea cuando se cierra la pestaña o navegador
window.onbeforeunload = function () {
    let usuariosEnLinea = JSON.parse(localStorage.getItem("usuariosEnLinea")) || [];
    usuariosEnLinea = usuariosEnLinea.filter((user) => user !== usuario);
    localStorage.setItem("usuariosEnLinea", JSON.stringify(usuariosEnLinea));
};
