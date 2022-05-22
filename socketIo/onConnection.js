const userHandlers = require('./handlers/user.handlers.js')
const messageHandlers = require('./handlers/message.handlers')

module.exports = function onConnection(io, socket) {
  const { roomId, userName, recipientUserName } = socket.handshake.query
  let users = {}

  socket.roomId = roomId
  socket.userName = userName
  socket.recipientUserName = recipientUserName

  users[userName] = socket.id

  socket.join(roomId)

  userHandlers(io, socket)

  messageHandlers(io, socket)
}
