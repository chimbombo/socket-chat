const { io } = require('../server');
const { Users } = require('../classes/users')
const { createMessage } = require('../utilities/utilities')


const users = new Users()


io.on('connection', (client) => {

    client.on('entrarChat', (user, callback) => {
        if (!user.name || !user.room) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            })
        }

        client.join(user.room)

        users.addUser(client.id, user.name, user.room)

        client.broadcast.to(user.room).emit('listaPersonas', users.getUsersforRoom(user.room))

        callback(users.getUsersforRoom(user.room))
    })

    client.on('createMessage', (data) => {
        let people = users.getUser(client.id);
        let message = createMessage(people.name, data.message);
        client.broadcast.to(people.message).emit('crearMensaje', message)
    })

    client.on('disconnect', () => {
        let deletedPeople = users.deleteUser(client.id)

        client.broadcast.to(deletedPeople.room).emit('crearMensaje', createMessage('Admin', `${deletedPeople.name} salió`))
        client.broadcast.to(deletedPeople.room).emit('listaPersonas', users.getUsersforRoom(deletedPeople.room))
    })

    //mensaje privado
    client.on('privateMessage', (data) => {
        let people = users.getUser(client.id)
        client.broadcast.to(data.to).emit('privateMessage', createMessage(people.name, data.message))
    })
});