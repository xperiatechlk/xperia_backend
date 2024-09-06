const { Repair } = require("../model/Repair");

class RepairController {
    // Add Repair
    async addRepair(req, res) {
        try {
            // Create a new Repair object
            const repair = new Repair({
                date: req.body.date,
                name: req.body.name,
                deviceType: req.body.deviceType,
                fault: req.body.fault,
                contactNumber: req.body.contactNumber,
                price: req.body.price,
                status: req.body.status, // e.g., pending, done, delivered
            });

            // Save the repair object
            await repair.save();
            res.status(201).json({ success: true, message: 'Repair added successfully' });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Retrieve all Repairs
    async getRepairs(req, res) {
        try {
            const repairs = await Repair.find();
            res.json(repairs);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Repair by ID
    async getRepairById(req, res) {
        const { id } = req.params;
        try {
            const repair = await Repair.findById(id);
            if (!repair) return res.status(404).json({ message: 'Repair not found' });

            res.json(repair);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update Repair
    async updateRepair(req, res) {
        const { id } = req.params;

        try {
            let repair = await Repair.findById(id);
            if (!repair) return res.status(404).json({ message: 'Repair not found' });

            // Update repair details
            Object.assign(repair, req.body);
            await repair.save();
            res.json({ success: true, message: 'Repair updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete Repair
    async deleteRepair(req, res) {
        const { id } = req.params;

        try {
            const repair = await Repair.findByIdAndDelete(id);
            if (!repair) return res.status(404).json({ message: 'Repair not found' });

            res.json({ success: true, message: 'Repair deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new RepairController();
