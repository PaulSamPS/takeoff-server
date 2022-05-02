module.exports = class UserDto {
  id
  name
  email
  position
  level
  avatar
  isAuth
  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.email = model.email
    this.position = model.position
    this.level = model.level
    this.avatar = model.avatar
    this.isAuth = model.isAuth
  }
}
