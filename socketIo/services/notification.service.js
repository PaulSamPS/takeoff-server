const Notification = require('../../models/notification.model')

const getAllNotifications = async (userId) => {
  const notifications = await Notification.findOne({ user: userId })
    .populate('user')
    .populate('notifications.user')
    .populate('notifications.post')
  if (!notifications) return 'Нет оповещений'

  return notifications
}

module.exports = { getAllNotifications }
