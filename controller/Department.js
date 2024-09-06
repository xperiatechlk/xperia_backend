const { Department } = require("../model/Department");

class DepartmentController {
    // Add Department
    async addDepartment(req, res) {
        const department = new Department(req.body);
        try {
            await department.save();
            res.status(201).json({ success: true });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }

    // Retrieve all Departments
    async getDepartments(req, res) {
        try {
            const departments = await Department.find();
            res.json(departments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Department by ID
    async getDepartmentById(req, res) {
        const { id } = req.params;
        try {
            const department = await Department.findById(id);
            if (!department) return res.status(404).json({ message: 'Department not found' });

            res.json(department);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update Department
    async updateDepartment(req, res) {
        const { id } = req.params;

        try {
            let department = await Department.findById(id);
            if (!department) return res.status(404).json({ message: 'Department not found' });

            Object.assign(department, req.body);

            await department.save();
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete Department
    async deleteDepartment(req, res) {
        const { id } = req.params;

        try {
            const department = await Department.findByIdAndDelete(id);
            if (!department) return res.status(404).json({ message: 'Department not found' });

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new DepartmentController();
