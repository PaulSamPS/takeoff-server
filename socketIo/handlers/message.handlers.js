const { Message } = require('../../models/userModel')

let messages = {}
let rooms = {}

module.exports = function messageHandlers(io, socket) {
  const { roomId, userName, recipientUserName } = socket

  const updateMessageList = () => {
    io.to(roomId).emit('message_list:update', messages[roomId])
  }

  const updateRoomsList = () => {
    io.emit('rooms_list:update', rooms)
  }

  socket.on('message:get', async () => {
    try {
      messages[roomId] = await Message.findAll({ where: { roomId } })
      console.log(messages[roomId])

      updateMessageList()
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('rooms:get', async () => {
    try {
      rooms = await Message.findAll({ where: { userName } })
      updateRoomsList()
    } catch (e) {
      console.log(e)
    }
  })

  socket.on('message:add', (to, message) => {
    Message.create(message)

    messages[roomId].push(message)

    updateMessageList()
    updateRoomsList()
  })

  socket.on('message:remove', (message) => {
    const { id } = message

    Message.destroy({ where: { id } }).then(() => {
      messages[roomId] = messages[roomId].filter((m) => m.id !== id)
    })

    updateMessageList()
  })
}
