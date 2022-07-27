const { getAllNotifications } = require('../services/notification.service')
module.exports = function notificationHandler(io, socket) {
  socket.on('notification:get', async ({ userId }) => {
    const notification = await getAllNotifications(userId)

    socket.emit('notifications', { notification })
  })
}
