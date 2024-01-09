//RESTABLECER CONTRASEÑA
document.getElementById('resetPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault()

    let token = window.location.pathname.split('/').pop()

    let actionUrl = '/restablecerContrasenia/' + token

    this.action = actionUrl

    this.submit()
})


