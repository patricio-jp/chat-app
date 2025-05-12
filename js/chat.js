const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const submitButton = document.getElementById("submit-button");
const messages = document.getElementById("chat-messages");
const onlineUsers = document.getElementById("online-users");
const userChats = document.getElementById("user-chats");
const usersList = document.getElementById("users");
const userSpan = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");

// Obtener el usuario actual desde localStorage
const usuario = JSON.parse(localStorage.getItem("user"));
const tokenUsuario = localStorage.getItem("token");

// Verificar si hay un usuario registrado
if (!tokenUsuario || !usuario) {
    // Si no hay usuario, redirigir a login
    window.location.href = "login.html";
}

const onlineUsersList = new Map();

// Establecer conexión mediante socket.io
const socket = io('ws://localhost:3000', {
    auth: {
        token: tokenUsuario
    }
});


// Obtener los usuarios que se encuentran conectados
socket.emit('whoIsOnline');
socket.on('onlineUsers', (users) => {
    //console.log(users);
    users.forEach((user) => {
        //console.log(user)
        if (!onlineUsersList.has(user)) {
            onlineUsersList.set(user, true);
        }

        let listadoChats = JSON.parse(localStorage.getItem("chats")) || [];
        const hasChat = listadoChats.some(chat => chat.participants.includes(user));
        if (hasChat) {
            const chatItem = document.getElementById(user);
            if (chatItem && chatItem.parentNode) {
                chatItem.parentNode.removeChild(chatItem);
                onlineUsers.appendChild(chatItem);
            }
        }
    })
})


//obtenerUsuarios();
//obtenerChatsDelUsuario();

// Mostrar nombre del usuario en la interfaz
userSpan.textContent = usuario.username;

// Escuchar el evento que un nuevo usuario se conectó
socket.on('userOnline', (user) => {
    //console.log(user);
    if (!onlineUsersList.has(user._id)) {
        onlineUsersList.set(user._id, true);
    }
    //console.log(onlineUsersList)
});

// Mostrar usuarios
mostrarUsuariosEnLinea();

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
    // Eliminar el usuario de la lista de usuarios en línea
    /* let usuariosEnLinea = JSON.parse(localStorage.getItem("usuariosEnLinea")) || [];
    usuariosEnLinea = usuariosEnLinea.filter((user) => user !== usuario);
    localStorage.setItem("usuariosEnLinea", JSON.stringify(usuariosEnLinea)); */

    // Limpiar los datos del usuario y redirigir al login
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("receptorActivo");
    localStorage.removeItem('chats');
    localStorage.removeItem('usersList');
    window.location.href = "login.html";
});

// Mostrar la lista de usuarios en línea y permitir seleccionar para chatear
async function obtenerUsuarios() {
    fetch('http://localhost:3000/api/users', {
        headers: {
            Authorization: `Bearer ${tokenUsuario}`,
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Ocurrió un error al obtener el listado de usuarios");
        return res.json();
    }).then((data) => {
        //console.log(data);
        localStorage.setItem("usersList", JSON.stringify(data));
    });
}

async function obtenerChatsDelUsuario() {
    fetch('http://localhost:3000/api/chats', {
        headers: {
            Authorization: `Bearer ${tokenUsuario}`,
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Ocurrió un error al obtener el listado de chats");
        return res.json();
    }).then((data) => {
        //console.log(data);
        localStorage.setItem("chats", JSON.stringify(data));
    });
}

// Mostrar la lista de usuarios en línea y permitir seleccionar para chatear
async function mostrarUsuariosEnLinea() {
    await obtenerUsuarios();
    await obtenerChatsDelUsuario();
    let listadoUsuarios = JSON.parse(localStorage.getItem("usersList")) || [];
    let listadoChats = JSON.parse(localStorage.getItem("chats")) || [];
    const receptorActivo = JSON.parse(localStorage.getItem("receptorActivo"));

    onlineUsers.innerHTML = ""; // Limpiar lista de usuarios
    userChats.innerHTML = "";
    usersList.innerHTML = "";

    listadoUsuarios.forEach((user) => {
        if (user._id !== usuario._id) {
            const userItem = document.createElement("li");
            userItem.id = user._id;
            userItem.className =
                "p-2 bg-gray-100 rounded mb-1 cursor-pointer hover:bg-blue-200";
            userItem.textContent = user.username;

            // Resaltar al usuario con el que estamos chateando
            if (user === receptorActivo) {
                userItem.classList.add("bg-blue-300", "font-semibold", "animate-bounce");
            }

            
            // Chequear si el usuario ya mantuvo un chat con el usuario
            /* const hasChat = listadoChats.some(chat => chat.participants.includes(user._id)); */
            const chat = listadoChats.find(chat => chat.participants.includes(user._id));
            if (chat) {
                //console.log(chat)
                userItem.setAttribute('chat', chat._id);
                if (onlineUsersList.has(user._id)) {
                    onlineUsers.appendChild(userItem);
                } else {
                    userChats.appendChild(userItem);
                }
            } else {
                usersList.appendChild(userItem);
            }
            
            userItem.addEventListener("click", () => {
                localStorage.setItem("receptorActivo", JSON.stringify(chat ? chat : user));
                mostrarMensajesCon(user);
                mostrarUsuariosEnLinea(); // Volver a actualizar la lista de usuarios
            });
            //onlineUsers.appendChild(userItem);

        }
    });
}

// Mostrar los mensajes con el receptor seleccionado
function mostrarMensajesCon(receptor) {
    //console.log(receptor)
    submitButton.removeAttribute('disabled');
    submitButton.classList.remove('cursor-not-allowed');
    input.removeAttribute('disabled');
    input.classList.remove('cursor-not-allowed');
    messages.innerHTML = ""; // Limpiar mensajes previos

    // Obtener chat (si es que no tiene previamente uno, crearlo)
    let listadoChats = JSON.parse(localStorage.getItem("chats")) || [];
    let chatId = '';
    const chat = listadoChats.find(chat => chat.participants.includes(receptor._id));
    if (chat) {
        chatId = chat._id;
    } else {
        // Crear nuevo chat y asignar el id
        const nuevoChat = {
            participants: [receptor._id]
        }
        socket.emit('createChat', (nuevoChat));
    }

    // Mostrar título del chat con el receptor
    const tituloExistente = document.getElementById("chat-title");
    if (tituloExistente) {
        tituloExistente.remove();
    }

    const titulo = document.createElement("h2");
    titulo.id = "chat-title";
    titulo.className = "text-lg font-semibold mb-3";
    titulo.textContent = `Chateando con: ${receptor.username}`;
    messages.appendChild(titulo);

    // Filtrar mensajes del historial de chat
    /* const historial = JSON.parse(localStorage.getItem("mensajesChat")) || [];
    const conversacion = historial.filter(
        (m) =>
            (m.emisor === usuario && m.receptor === receptor.username) ||
            (m.emisor === receptor.usename && m.receptor === usuario)
    ); */

    let conversacion = [];
    fetch(`http://localhost:3000/api/messages/${chatId}`, {
        headers: {
            Authorization: `Bearer ${tokenUsuario}`,
        }
    }).then((res) => {
        if (!res.ok) throw new Error("Ocurrió un error al obtener los mensajes del chat");
        return res.json();
    }).then((data) => {
        conversacion = data;

        // Mostrar los mensajes de la conversación
        conversacion.forEach((mensaje) => {
            const messageContainer = document.createElement("div");
            messageContainer.className = "flex mb-2";
    
            const msg = document.createElement("div");
            msg.className = "p-2 rounded max-w-xs break-words";
            const hora = new Date(mensaje.createdAt || new Date());
            const horas = hora.getHours().toString().padStart(2, "0");
            const minutos = hora.getMinutes().toString().padStart(2, "0");
            const horaFormateada = `${horas}:${minutos}`;
    
            msg.textContent = `${mensaje.content}  ${horaFormateada}`;
    
            if (mensaje.sender === usuario._id) {
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
    })

}

// Enviar un mensaje
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = input.value.trim();
    const chat = JSON.parse(localStorage.getItem("receptorActivo"));

    if (text !== "" && chat) {
        const mensaje = {
            from: usuario._id,
            to: chat._id,
            content: text,
        };

        socket.emit('sendMessage', mensaje);
        input.value = ""; // Limpiar el campo de entrada
    }
});

// Escuchar evento para nuevos mensajes
socket.on('message', (mensaje) => {
    const chatActivo = JSON.parse(localStorage.getItem("receptorActivo"));

    if (mensaje.chatId === chatActivo._id) {
        const messageContainer = document.createElement("div");
        messageContainer.className = "flex mb-2";
    
        const msg = document.createElement("div");
        msg.className = "p-2 rounded max-w-xs break-words";
        const hora = new Date(mensaje.createdAt || new Date());
        const horas = hora.getHours().toString().padStart(2, "0");
        const minutos = hora.getMinutes().toString().padStart(2, "0");
        const horaFormateada = `${horas}:${minutos}`;
    
        msg.textContent = `${mensaje.content}  ${horaFormateada}`;
    
        if (mensaje.from === usuario._id) {
            messageContainer.classList.add("justify-end");
            msg.classList.add("bg-blue-200", "text-right");
        } else {
            messageContainer.classList.add("justify-start");
            msg.classList.add("bg-green-200", "text-left");
        }
    
        messageContainer.appendChild(msg);
        messages.appendChild(messageContainer);
        messages.scrollTop = messages.scrollHeight;
    }

});

socket.on('newChat', (newChat) => {
    console.log(newChat);
    //localStorage.setItem("receptorActivo", JSON.stringify(newChat));
    //mostrarUsuariosEnLinea();
    let listadoChats = JSON.parse(localStorage.getItem("chats")) || [];
    listadoChats.push(newChat);
    localStorage.setItem('chats' ,JSON.stringify(listadoChats));

    let listadoUsuarios = JSON.parse(localStorage.getItem("usersList")) || [];

    listadoUsuarios.forEach((user) => {
        const hasChat = listadoChats.some(newChat => newChat.participants.includes(user._id));
        if (hasChat) {
            const chatItem = document.getElementById(user._id);
            if (chatItem && chatItem.parentNode) {
                chatItem.setAttribute('chat', newChat._id);
                chatItem.parentNode.removeChild(chatItem);
                onlineUsers.appendChild(chatItem);
            }
        }
    })
})

// Escuchar evento cuando un usuario se desconecta
socket.on('userOffline', (userId) => {
    if (onlineUsersList.has(userId)) {
        onlineUsersList.delete(userId);
    }

    const userItem = document.getElementById(userId);
    let listadoChats = JSON.parse(localStorage.getItem("chats")) || [];

    const chat = listadoChats.find(chat => chat.participants.includes(userId));
    if (chat) {
        //console.log(chat)
        userItem.setAttribute('chat', chat._id);
        if (onlineUsersList.has(userId)) {
            onlineUsers.appendChild(userItem);
        } else {
            userChats.appendChild(userItem);
        }
    } else {
        usersList.appendChild(userItem);
    }
    
    userItem.addEventListener("click", () => {
        localStorage.setItem("receptorActivo", JSON.stringify(chat ? chat : user));
        mostrarMensajesCon(user);
        mostrarUsuariosEnLinea(); // Volver a actualizar la lista de usuarios
    });

});


// Eliminar usuario de la lista de usuarios en línea cuando se cierra la pestaña o navegador
/* window.onbeforeunload = function () {
    let usuariosEnLinea = JSON.parse(localStorage.getItem("usuariosEnLinea")) || [];
    usuariosEnLinea = usuariosEnLinea.filter((user) => user !== usuario);
    localStorage.setItem("usuariosEnLinea", JSON.stringify(usuariosEnLinea));
}; */
