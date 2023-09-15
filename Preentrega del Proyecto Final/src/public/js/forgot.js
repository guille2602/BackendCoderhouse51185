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
            Swal.fire({
                icon: "info",
                title: "Por favor revise su casilla de correo",
                willClose: () => {
                    location.replace('/login');
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                title: "Hubo un problema al cambiar la contraseña",
            })
        }
    } )


})