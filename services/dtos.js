module.exports = class UserDto {
  email
  name
  constructor(model) {
    this.email = model.email
    this.name = model.name
  }
}
