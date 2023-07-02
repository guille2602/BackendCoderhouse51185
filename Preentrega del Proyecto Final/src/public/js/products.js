function handleAddToCart(event, product) {
    event.preventDefault();
    const serverAdress =`/api/carts/cart/product/${product}`

    fetch(serverAdress, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          data.status == "Sucess" && alert("Producto agregado al carrito");
          data.status == "Failed" && alert("No autorizado");
        })
        .catch(error => {
          console.error('Error:', error);
        });
}