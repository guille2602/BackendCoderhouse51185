export default class userDTO {
    
    constructor(user) {
        this.name = `${user.first_name} ${user.last_name}`,
        this.email = user.email,
        this.age = user.age,
        this.cart = user.cart,
        this.role = user.role
    }

}

export class minUserDTO {

    constructor(user) {
    this.name = `${user.first_name} ${user.last_name}`,
    this.email = user.email,
    this.role = user.role,
    this.last_connection = user.last_connection,
    this.avatar = user.avatar || ""
}

}