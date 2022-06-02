const userHandlers = require('./handlers/user.handlers')
const messageHandlers = require('./handlers/message.handlers')

module.exports = function onConnection(io, socket) {
  userHandlers(io, socket)

  messageHandlers(io, socket)
}
