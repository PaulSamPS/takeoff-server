module.exports = class UserDto {
    id
    name
    avatar
    constructor(model) {
        this.id = model.id
        this.name = model.name
        this.avatar = model.avatar
    }
}
