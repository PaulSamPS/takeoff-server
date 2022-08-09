module.exports = class UserDto {
  id
  firstName
  lastName
  email
  role
  avatar
  lastVisit
  bio
  settings
  constructor(model) {
    this.id = model.id
    this.firstName = model.firstName
    this.lastName = model.lastName
    this.email = model.email
    this.role = model.role
    this.avatar = model.avatar
    this.lastVisit = model.lastVisit
    this.bio = model.bio
    this.settings = model.settings
  }
}
