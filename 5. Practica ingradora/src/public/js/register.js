const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (event) => {

    event.preventDefault();
    const objectForm = {};
    const data = new FormData(registerForm);
    data.forEach( ( value , key ) => objectForm[key] = value);
    fetch ("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(objectForm),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then (result => result.json())
    .then (result => {
        if (result.status === "Sucess") {
            registerForm.reset();
            window.location.replace("/login");
        } else {
            console.log(result.message)
        }
    })
})