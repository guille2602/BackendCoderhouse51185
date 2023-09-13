const onRoleUpdate = async (event, uid) => {
    event.preventDefault();
    await fetch (`/api/users/premium/${uid}`)
    .then(response => response.json())
    .then( (data) => {
        data.status === "success" && alert('Rol cambiado correctamente');
        data.status === "failed" && alert('No se puede cambiar el rol, se debe completar documentación')
        console.log(data)
        location.reload();
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
        data.status === "success" && alert('Usuario eliminado correctamente');
        data.status === "failed" && alert('Ocurrió un error al eliminar');
        location.reload();
    })
}