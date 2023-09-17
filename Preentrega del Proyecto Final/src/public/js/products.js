function getCurrentCartId() {
    return fetch("/api/sessions/current")
        .then((response) => response.json())
        .then((data) => data?.payload?.cart?._id);
}

function handleAddToCart(event, product) {
    event.stopPropagation();
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
                    if (data.message){
                        data.message === "No se encuentra logueado" &&
                            Swal.fire({
                                icon: "warning",
                                title: "Debes iniciar sesión para agregar productos al carrito",
                        })
                    } else {
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
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
}

async function handlePurchase(event) {
    event.preventDefault();
    getCurrentCartId().then((cartId) => {
        fetch(`/api/carts/${cartId}/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (
                    data.message === "No hay stock suficiente para procesar el pedido"
                ) {
                    return Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "No hay suficiente stock para realizar el pedido",
                    })
                }
                if (
                    data.status === "failed" &&
                    data.message === "empty cart"
                ) {
                    return Swal.fire({
                        icon: "error",
                        title: "Carrito vacío",
                        text: "No has agregado productos al carrito",
                    });
                }
                if (
                    data.status === "failed"
                ) {
                    return Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Se ha producido un error en la compra",
                    });
                }
                if (
                    data.status === "success"
                ) {
                    let text = `Productos rechazados por falta de stock: \n`;
                    data?.rejected?.length > 0 &&
                    data.rejected.forEach((element) => {
                        text = text.concat(
                            `\n ${element.product.title} (Cant: ${element.quantity})`
                        );
                    });
                    return Swal.fire({
                        icon: "Success",
                        title: "¡Compra exitosa!",
                        willClose: () => {
                            location.reload();
                        },
                        html: `
                        <div>
                            <p>Fecha y hora: ${data.ticket.purchase_datetime}</p>
                            <p>N° de ticket: ${data.ticket.code}</p>
                            <b><p>Total operación: $${data.ticket.amount}</p></b>
                            ${data.rejected.length > 0 ? '<p>' + text + '</p>' : ''}
                        </div>
                    `,})
                }
            });
    });
}

async function handleEmptyCart(event) {
    getCurrentCartId().then((cartId) => {
        fetch(`/api/carts/${cartId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "Se ha vaciado el carrito",
                        willClose: () => {
                            location.reload();
                        }
                    })
                }
                if (data.status === "failed") {
                    Swal.fire({
                        icon: "warning",
                        title: "Ha ocurrido un error al vaciar el carrito",
                    })
                }
            });
    });
}

function handleGoToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    getCurrentCartId().then((cartId) => {
        window.location.replace(`/carts/${cartId}`);
    });
}

function handleDeleteProduct(event, pid) {
    event.preventDefault();
    const productId = pid.toString();
    getCurrentCartId().then((cartId) => {
        fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "Producto eliminado del carrito",
                        willClose: () => {
                            location.reload();
                        }
                    })
                }
                if (data.status === "failed") {
                    Swal.fire({
                        icon: "error",
                        title: "Ha ocurrido un error al vaciar el carrito",
                        willClose: () => {
                            location.reload();
                        }
                    })
                }
            });
    });
}

function goToProduct(event, id) {
    event.preventDefault();
    location.replace(`/products/${id}`);
}
