const { Staff } = require("../model/Staff");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


class StaffController {
    // Add Staff
    async addStaff(req, res) {
        try {
            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            // Create a new Staff object
            const staff = new Staff({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                phoneNumber: req.body.phoneNumber,
                emailAddress: req.body.emailAddress,
                address: req.body.address,
                employeeID: req.body.employeeID,
                departmentID: req.body.departmentID,
                password: hashedPassword,
                role: req.body.role,
                hireDate: req.body.hireDate,
                permission: req.body.permission,
            });

            // Save the staff object
            await staff.save();
            res.status(201).json({ success: true, message: 'Staff member added successfully' });
        } catch (err) {
            // Handle validation or other errors
            if (err.code === 11000) {
                // Duplicate email
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Login Staff
    async login(req, res) {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both email and password' });
        }

        try {
            // Find the staff member by email
            const staff = await Staff.findOne({ 'emailAddress':email });
            if (!staff) {
                return res.status(400).json({ success: false, message: 'Invalid email' });
            }

            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, staff.password); 
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid password' });
            }

            // Generate a token (optional)
            const token = jwt.sign(
                { id: staff._id, email: staff.email },
                process.env.JWT_SECRET, // Make sure to set this in your .env file
                { expiresIn: '1h' } // Token expiry time
            );

            // Send the response with token and staff details
            res.json({
                success: true,
                message: 'Login successful',
                token,
                staff: {
                    id: staff._id,
                    firstName: staff.firstName,
                    lastName: staff.lastName,
                    email: staff.email,
                    phoneNumber: staff.phoneNumber,
                    departmentID: staff.departmentID,
                    role:staff.role,
                    hireDate: staff.hireDate,
                    permission: staff.permission,
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }

    // Retrieve all Staff
    async getStaff(req, res) {
        try {
            const staff = await Staff.find();
            res.json(staff);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Staff by ID
    async getStaffById(req, res) {
        const { id } = req.params;
        try {
            const staff = await Staff.findById(id);
            if (!staff) return res.status(404).json({ message: 'Staff not found' });

            res.json(staff);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Update Staff
    async updateStaff(req, res) {
        const { id } = req.params;
        const { password } = req.body;

        try {
            let staff = await Staff.findById(id);
            if (!staff) return res.status(404).json({ message: 'Staff not found' });

            // If password is provided, hash it
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 12);
                req.body.password = hashedPassword;
            }

            // Update staff details
            Object.assign(staff, req.body);
            await staff.save();
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }


    // Delete Staff
    async deleteStaff(req, res) {
        const { id } = req.params;

        try {
            const staff = await Staff.findByIdAndDelete(id);
            if (!staff) return res.status(404).json({ message: 'Staff not found' });

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new StaffController();
