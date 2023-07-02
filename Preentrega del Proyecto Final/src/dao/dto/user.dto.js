export default class userDTO {
    
    constructor(user) {
        this.name = `${user.first_name} ${user.last_name}`,
        this.email = user.email,
        this.age = user.age,
        this.cart = user.cart,
        this.role = user.role
    }

}