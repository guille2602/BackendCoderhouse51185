const recoverPassForm = document.getElementById('recoverPassForm');

recoverPassForm.addEventListener('submit', ( event ) => {
    event.preventDefault();
    const data = new FormData(recoverPassForm);
    const objectForm = {};
    data.forEach(( value, key ) => objectForm[key] = value)
    
    fetch("/api/sessions/forgot-password",{
        method: "POST",
        body: JSON.stringify(objectForm),
        headers:{
            "Content-Type":"application/json"
        }
    }). then(( result ) => {
        if (result.status == 200){
            //Si es correcto, redirigir a lista de productos con bienvenida
            alert("Por favor revise su casilla de correo");
            window.location.replace('/login')
        } else {
            //Enviar un sweet alert
            console.log('Hubo un problema al cambiar la contraseña')
            alert('Hubo un problema al cambiar la contraseña')
        }
    } )


})