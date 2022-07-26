module.exports = class UserDto {
  id
  firstName
  lastName
  email
  role
  avatar
  lastVisit
  notifications
  bio
  constructor(model) {
    this.id = model.id
    this.firstName = model.firstName
    this.lastName = model.lastName
    this.email = model.email
    this.role = model.role
    this.avatar = model.avatar
    this.lastVisit = model.lastVisit
    this.notifications = model.notifications
    this.bio = model.bio
  }
}
