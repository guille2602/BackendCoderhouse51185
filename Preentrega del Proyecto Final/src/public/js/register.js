const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (event) => {

    event.preventDefault();
    const data = new FormData(registerForm);
    fetch ("/api/sessions/register", {
        method: "POST",
        body: data,
    })
    .then (result => result.json())
    .then (result => {
        if (result.status === "sucess") {
            registerForm.reset();
            window.location.replace("/login");
        } else {
            console.log(result)
        }
    })
})