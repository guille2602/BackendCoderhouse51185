//Cart imports
import { CartsRepository } from './carts.repository.js';
import MongoCartManager from "../dao/mongoManagers/dbCartManager.js";
//Product imports
import MongoProductManager from '../dao/mongoManagers/dbProductManager.js';
import { ProductsRepository } from './products.repository.js';
//Chat imports
import { ChatRepository } from './chat.repository.js';
import messageModel from '../dao/models/messages.model.js';
//Session imports
import { SessionsRepository }from './sessions.repository.js';
import userModel from '../dao/models/user.model.js';
//Ticket imports
import MongoTicketManager from '../dao/mongoManagers/dbTicketManager.js';
import { TicketRepository } from './tickets.repository.js'

//Cart
const cartManager = new MongoCartManager();
export const cartsService = new CartsRepository(cartManager);
//Product
const prodManager = new MongoProductManager();
export const productService = new ProductsRepository(prodManager);
//Chat
export const chatService = new ChatRepository(messageModel);
//User session
export const userService = new SessionsRepository(userModel);
//Ticket
const ticketManager = new MongoTicketManager();
export const ticketService = new TicketRepository(ticketManager);