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

// socket.on('updatelist', (data) =>{
//     let products = document.getElementById('products');
//     products.innerHTML = "";
//     data.forEach((prod)=>{
//         console.log(prod);
//         const productDiv = document.createElement('div');
//         productDiv.classList.add('product');
//         const productId = document.createElement('h2');
//         productId.textContent = `Id: ${prod._id}`;
//         productDiv.appendChild(productId);
//         const productTitle = document.createElement('h2');
//         productTitle.textContent = `Title: ${prod.title}`;
//         productDiv.appendChild(productTitle);
//         const productDescription = document.createElement('h2');
//         productDescription.textContent = `Description: ${prod.description}`;
//         productDiv.appendChild(productDescription);
//         const productCode = document.createElement('h2');
//         productCode.textContent = `Code: ${prod.code}`;
//         productDiv.appendChild(productCode);
//         const productPrice = document.createElement('h2');
//         productPrice.textContent = `Price: ${prod.price}`;
//         productDiv.appendChild(productPrice);
//         const productStatus = document.createElement('h2');
//         productStatus.textContent = `Status: ${prod.status}`;
//         productDiv.appendChild(productStatus);
//         const productStock = document.createElement('h2');
//         productStock.textContent = `Stock: ${prod.stock}`;
//         productDiv.appendChild(productStock);
//         const productCategory = document.createElement('h2');
//         productCategory.textContent = `Category: ${prod.category}`;
//         productDiv.appendChild(productCategory);
//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Eliminar';
//         deleteButton.addEventListener('click', () => {
//             handleDelete('id_'+prod._id);
//         });
//         productDiv.appendChild(deleteButton);
//         products.insertAdjacentElement('beforeend', productDiv);
//     });
// });

socket.on("updatelist", (data) => {
    let products = document.getElementById("products");
    products.innerHTML = "";
    data.forEach((prod) => {
        const htmlProd = `
        <div class="product">
            <h2>Id: ${prod._id}</h2>
            <h2>Title: ${prod.title}</h2>
            <h2>Description: ${prod.description}</h2>
            <h2>Code: ${prod.code}</h2>
            <h2>Price: ${prod.price}</h2>
            <h2>Status: ${prod.status}</h2>
            <h2>Stock: ${prod.stock}</h2>
            <h2>Category: ${prod.category}</h2>
            <button onclick="handleDelete('id_${prod._id}')" class="btn btn-primary">Eliminar</button>
        </div>
        `;
        products.innerHTML += htmlProd;
    });
});
