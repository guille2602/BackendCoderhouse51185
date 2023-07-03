export class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async createTicket(info) {
        const { code, purchase_datetime, amount, purchaser } = info;
        const payload = await this.dao.createTicket(
            code,
            purchase_datetime,
            amount,
            purchaser
        );
        return payload;
    }
}
