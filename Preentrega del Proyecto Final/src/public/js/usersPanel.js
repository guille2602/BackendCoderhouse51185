const onRoleUpdate = async (event, uid) => {
    event.preventDefault();
    await fetch (`/api/users/premium/${uid}`)
    .then(response => response.json())
    .then( (data) => {
        data.status === "success" && Swal.fire({
            icon: "success",
            title: "Rol modificado correctamente.",
            willClose: () => {
                location.reload();
            },
        });
        data.status === "failed" && Swal.fire({
            icon: "error",
            title: "Error al modificar el rol",
            text: "Por favor revise la documentación a presentar"
        });
    }
    )
}

const onDelete = async (event, uid) => {
    event.preventDefault();
    await fetch (`/api/users/${uid}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.status === "success" && Swal.fire({
            icon: "success",
            title: "Usuario eliminado correctamente",
        });
        data.status === "failed" && Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error al eliminar el usuario",
        });
    })
}