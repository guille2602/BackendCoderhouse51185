const logoutButton = document.getElementById("logout-btn");

logoutButton.addEventListener("click", ( event ) => {
    event.preventDefault();
    fetch("/api/sessions/logout").then((result) => {
        if (result.status == 200){
            console.log('Sesión cerrada exitosamente')
            window.location.replace('/login')
        } else
        {console.log("Error al cerrar la sesión")}
    })
})