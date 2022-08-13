const { getAllNotifications } = require('../services/notification.service')
const User = require('../../models/user.model')
module.exports = function notificationHandler(io, socket) {
  socket.on('notification:get', async ({ userId }) => {
    const notification = await getAllNotifications(userId)
    socket.emit('notifications', { notification })
  })

  socket.on('notifications:countGet', async ({ userId }) => {
    const user = await User.findById(userId)
    socket.emit('notifications:countSuccess', { count: user.notificationCount })
  })

  socket.on('notifications:read', async ({ userId, readNotificationsCount }) => {
    const user = await User.findById(userId)
    if (user) {
      user.notificationCount = user.notificationCount - readNotificationsCount
      await user.save()
    }
    socket.emit('notifications:unread', { count: user.notificationCount })
  })
}
