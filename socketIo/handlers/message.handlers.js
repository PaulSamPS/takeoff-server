const { loadMessages, sendMsg, setMsgToUnread } = require('../services/message.service')
const { findConnectedUser } = require('../services/room.service')

module.exports = function messageHandlers(io, socket) {
  socket.on('messages:get', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith)
    !error ? socket.emit('message_list:update', { chat }) : socket.emit('chat:notFound')
  })

  socket.on('message:add', async ({ userId, msgSendToUserId, message }) => {
    const { newMessage, error } = await sendMsg(userId, msgSendToUserId, message)
    const receiverSocket = await findConnectedUser(msgSendToUserId)

    if (receiverSocket) {
      io.to(receiverSocket.socketId).emit('message:received', { newMessage })
    } else {
      await setMsgToUnread(msgSendToUserId)
    }
    !error && socket.emit('messages:sent', { newMessage })
  })
}
