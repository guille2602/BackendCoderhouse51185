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

async function handlePurchase(event){
  fetch(`/api/carts/cart/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data =>{
    if (data.message === "No hay stock suficiente para procesar el pedido"){
      alert('No hay suficiente stock para realizar el pedido');
      return;
    }
    console.log(data);
    let text = `Productos rechazados por falta de stock: \n`
    data.rejected.length > 0 && data.rejected.forEach(element => {
      text = text.concat( `\n ${element.product.title} (Cant: ${element.quantity})`);
    })
    if ( data.status === "Sucess"){
      alert(`
      Compra finalizada con éxito! \n
      Fecha y hora: ${data.ticket.purchase_datetime} \n 
      N° de ticket: ${data.ticket.code} \n 
      Total operación: $${data.ticket.amount}\n 
      ${data.rejected.length > 0 && text}
      `)
    }
    if ( data.status === "Failed" ){
      alert('Se ha producido un error en la compra');
      console.log(data);
    }
    location.reload();
  })
}

async function handleEmptyCart(event){
  fetch(`/api/carts/cart`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data =>{
    if ( data.status === "Sucess"){
      alert(`Carrito vaciado con éxito`)
      location.reload();
    }
    if ( data.status === "Failed" ){
      alert('Ha ocurrido un error al vaciar el carrito');
    }
  })
}

//Funcion para ir al carrito desde un fetch del current

  function handleGoToCart(event){
  event.preventDefault();
  fetch("/api/sessions/current")
  .then(response=> response.json())
  .then(data => {
    const cartId = data.payload.cart._id
    window.location.replace(`/carts/${cartId}`)
  })

}