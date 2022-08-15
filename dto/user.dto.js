module.exports = class UserDto {
  id
  name
  email
  role
  avatar
  lastVisit
  bio
  settings
  notificationCount
  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.email = model.email
    this.role = model.role
    this.avatar = model.avatar
    this.lastVisit = model.lastVisit
    this.bio = model.bio
    this.settings = model.settings
    this.notificationCount = model.notificationCount
  }
}
