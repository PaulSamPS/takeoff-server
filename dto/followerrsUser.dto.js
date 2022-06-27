module.exports = class UserDto {
  id
  name
  avatar
  position
  constructor(model) {
    this.id = model.id
    this.name = model.name
    this.avatar = model.avatar
    this.position = model.position
  }
}
