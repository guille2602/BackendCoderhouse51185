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
            window.location.replace('/products')
        } else {
            Swal.fire({
                icon: "error",
                title: "Datos incorrectos",
                text: "Revise la información suministrada",
                // willClose: () => {
                //     location.reload();
                // }
            })
        }
    } )
})

