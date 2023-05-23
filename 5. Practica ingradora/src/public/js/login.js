const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', ( event ) => {
    event.preventDefault();
    //Mandar email y contraseña al back
    const data = new FormData(loginForm);
    const objectForm = {};
    data.forEach(( value, key ) => objectForm[key] = value)
    
    fetch("/api/sessions/login",{
        method: "POST",
        body: JSON.stringify(objectForm),
        headers:{
            "Content-Type":"application/json"
        }
    }). then(( result ) => {
        if (result.status == 200){
            //Si es correcto, redirigir a lista de productos con bienvenida
            window.location.replace('/products')
        } else {
            //Enviar un sweet alert
            console.log('Alguno de los datos es incorrecto')
        }
    } )


})