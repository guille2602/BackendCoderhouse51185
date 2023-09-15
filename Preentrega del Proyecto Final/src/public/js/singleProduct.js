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

function handleAddToCart(event, product) {
    getCurrentCartId().then((cartId) => {
        fetch(`/api/carts/${cartId}/products/${product}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                data.status == "success" &&
                    Swal.fire({
                        icon: "success",
                        title: "Producto agregado al carrito",
                    })
                if (data.status == "failed") {
                    data.description ===
                    "El usuario no puede agregar sus productos al carrito"
                        ? Swal.fire({
                            icon: "warning",
                            title: "No puedes comprar tus propios productos",
                        })
                        : Swal.fire({
                            icon: "warning",
                            title: "No estas autorizado a agregar productos al carrito",
                        });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
}