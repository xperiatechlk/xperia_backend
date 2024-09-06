const { Ticket } = require("../model/Ticket");

class TicketController {
    // Add Ticket
    async addTicket(req, res) {
        const ticket = new Ticket(req.body);
        try {
            await ticket.save();
            res.status(201).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }

    // Retrieve all Tickets
    async getTickets(req, res) {
        try {
            const tickets = await Ticket.find();
            res.json(tickets);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Ticket by ID
    async getTicketById(req, res) {
        const { id } = req.params;
        try {
            const ticket = await Ticket.findById(id);
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            res.json(ticket);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update Ticket
    async updateTicket(req, res) {
        const { id } = req.params;

        try {
            let ticket = await Ticket.findById(id);
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            Object.assign(ticket, req.body);

            await ticket.save();
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete Ticket
    async deleteTicket(req, res) {
        const { id } = req.params;

        try {
            const ticket = await Ticket.findByIdAndDelete(id);
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new TicketController();
