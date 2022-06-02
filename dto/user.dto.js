module.exports = class UserDto {
  id
  name
  email
  position
  level
  role
  avatar
  unreadMessage
  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.email = model.email
    this.position = model.position
    this.level = model.level
    this.role = model.role
    this.avatar = model.avatar
    this.unreadMessage = model.unreadMessage
  }
}
