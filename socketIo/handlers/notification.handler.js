const { getAllNotifications } = require('../services/notification.service')
const User = require('../../models/user.model')
module.exports = function notificationHandler(io, socket) {
  socket.on('notification:get', async ({ userId }) => {
    const notification = await getAllNotifications(userId)
    const user = await User.findById(userId)
    socket.emit('notifications:count', { count: user.notificationCount })
    socket.emit('notifications', { notification })
  })

  socket.on('notifications:read', async ({ userId, readNotificationsCount }) => {
    const user = await User.findById(userId)
    user.notificationCount = user.notificationCount - readNotificationsCount
    await user.save()
    socket.emit('notifications:unread', { count: user.notificationCount })
  })
}
