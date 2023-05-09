const socket = io();
let chatBox = document.getElementById("chatBox");
let user;

function handleSubmit(event){
    event.preventDefault();
    if (chatBox.value.trim().length > 0) {
        socket.emit("submitedMessage", {
            user: user,
            message: chatBox.value.trim(),
        });
        chatBox.value = "";
    }
}

Swal.fire({
    title: "Ingrese su email",
    input: "text",
    text: "Ingresa tu correo para poder acceder al chat",
    inputValidator: (value) => {
        return !value && "¡Necesitas identificarte para continuar!";
    },
    allowOutsideClick: false,
}).then((result) => {
    user = result.value;
    socket.emit('authenticated', user);
});

socket.on("updateChat", (data) => {
    let chats = document.getElementById("chats");
    let messages = "";
    data.forEach((chat) => {
        messages =
            messages +
            ` 
        <div class="user">
            ${chat.user} dice:
        </div>      
        <div class="message">
            ${chat.message}
        </div>`;
    });
    chats.innerHTML = messages;
});

socket.on("failedLogin", (data) => {
    Swal.fire(
        '¡Dirección de correo inválida!',
        'Por favor ingresa una dirección de correo válida',
        'error'
      ).then(() => {
        Swal.fire({
            title: "Ingrese su email",
            input: "text",
            text: "Ingresa tu correo para poder acceder al chat",
            inputValidator: (value) => {
                return !value && "¡Necesitas identificarte para continuar!";
            },
            allowOutsideClick: false,
        }).then((result) => {
            user = result.value;
            socket.emit('authenticated', user); 
            })
        }
      )
});

chatBox.addEventListener("keydown", (evt) => {
    if (evt.key === "Enter") {
        evt.preventDefault();
        if (chatBox.value.trim().length > 0) {
            socket.emit("submitedMessage", {
                user: user,
                message: chatBox.value.trim(),
            });
            chatBox.value = "";
        }
        return false;
    }
});
