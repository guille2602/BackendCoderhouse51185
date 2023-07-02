const socket = io();

let form = document.getElementById("newProdForm");
let submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", handleClick);

function handleClick(e) {
    e.preventDefault();
    let newProduct = {
        title: form.title.value,
        description: form.description.value,
        code: form.code.value,
        price: form.price.value,
        stock: form.stock.value,
        category: form.category.value,
        thumbnail: form.thumbnail.value,
    };
    socket.emit("addproduct", newProduct);
    form.reset();
}

function handleDelete(id) {
    let parsedId = id.substring(3, id.length);
    socket.emit("delete", parsedId);
}

socket.on("updatelist", (data) => {
    let products = document.getElementById("products");
    products.innerHTML = "";
    data.forEach((prod) => {
        const htmlProd = `
        <div class="product">
            <h2>Id: ${prod.id}</h2>
            <h2>Title: ${prod.title}</h2>
            <h2>Description: ${prod.description}</h2>
            <h2>Code: ${prod.code}</h2>
            <h2>Price: ${prod.price}</h2>
            <h2>Status: ${prod.status}</h2>
            <h2>Stock: ${prod.stock}</h2>
            <h2>Category: ${prod.category}</h2>
            <button onclick="handleDelete('id_${prod.id}')" class="btn btn-primary">Eliminar</button>
        </div>
        `;
        products.innerHTML += htmlProd;
    });
});
