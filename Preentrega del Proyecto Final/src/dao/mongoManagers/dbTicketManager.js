import ticketModel from "../models/ticket.model.js";

class MongoTicketManager {
    async createTicket(code, purchase_datetime, amount, purchaser) {
        try {
            const ticket = {
                code,
                purchase_datetime,
                amount,
                purchaser,
            };
            // if (!code || !purchase_datetime || !amount || !purchaser) //Se sacó la validación de purchaser porque en github autentication no trae el mail.
            if (!code || !purchase_datetime || !amount ) {
                return {
                    status: "Failed",
                    statusCode: 400,
                    message: "Datos incompletos al crear ticket",
                    payload: null,
                };
            }
            const payload = await ticketModel.create(ticket);
            return {
                status: "Sucess",
                message: "Ticket creado correctamente",
                statusCode: 200,
                payload,
            };
        } catch (error) {
            return {
                status: "Failed",
                statusCode: 500,
                message: `Ocurrió un error al conectar con la base de datos: ${error}`,
                payload: null,
            };
        }
    }
}

export default MongoTicketManager;
