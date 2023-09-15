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

function getCurrentCartId() {
    return fetch("/api/sessions/current")
        .then((response) => response.json())
        .then((data) => data?.payload?.cart?._id);
}

function handleGoToCart(event) {
    event.preventDefault();
    getCurrentCartId().then((cartId) => {
        window.location.replace(`/carts/${cartId}`);
    });
}