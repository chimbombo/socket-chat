var socket = io();
var params = new URLSearchParams(window.location.search)

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', user, function(resp) {
        console.log('Usuarios conectados: ', resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Antonio',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar cambios de usuarios
//cuando un usuario  entra o sale del chat
socket.on('listaPersonas', function(peoples) {
    console.log(peoples);
})

// mensajes privados
socket.on('privateMessage', function(message) {
    console.log(message);
})