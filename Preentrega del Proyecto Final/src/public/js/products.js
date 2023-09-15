function getCurrentCartId() {
    return fetch("/api/sessions/current")
        .then((response) => response.json())
        .then((data) => data?.payload?.cart?._id);
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
                    alert("Producto agregado al carrito");
                if (data.status == "failed") {
                    data.description ===
                    "El usuario no puede agregar sus productos al carrito"
                        ? alert("No puedes comprar tus propios productos")
                        : alert("No autorizado");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    });
}

async function handlePurchase(event) {
    getCurrentCartId().then((cartId) => {
        fetch(`/api/carts/${cartId}/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (
                    data.message ===
                    "No hay stock suficiente para procesar el pedido"
                ) {
                    alert("No hay suficiente stock para realizar el pedido");
                    return;
                }
                console.log(data);
                let text = `Productos rechazados por falta de stock: \n`;
                data.rejected.length > 0 &&
                    data.rejected.forEach((element) => {
                        text = text.concat(
                            `\n ${element.product.title} (Cant: ${element.quantity})`
                        );
                    });
                if (data.status === "success") {
                    alert(`
      Compra finalizada con éxito! \n
      Fecha y hora: ${data.ticket.purchase_datetime} \n 
      N° de ticket: ${data.ticket.code} \n 
      Total operación: $${data.ticket.amount}\n 
      ${data.rejected.length > 0 ? text : ""}
      `);
                }
                if (data.status === "failed") {
                    alert("Se ha producido un error en la compra");
                    console.log(data);
                }
                location.reload();
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
                    alert(`Carrito vaciado con éxito`);
                    location.reload();
                }
                if (data.status === "failed") {
                    alert("Ha ocurrido un error al vaciar el carrito");
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
                    alert(`Producto eliminado correctamente`);
                    location.reload();
                }
                if (data.status === "failed") {
                    alert("Ha ocurrido un error al eliminar el producto");
                }
            });
    });
}

function goToProduct(event, id){
    event.preventDefault();
    location.replace(`/products/${id}`)
}