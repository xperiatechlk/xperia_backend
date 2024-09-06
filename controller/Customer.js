const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Customer } = require("../model/Customer");

class CustomerController {
    // Add Customer
    async addCustomer(req, res) {
        try {
            const customer = new Customer(req.body);
            // Hash the password before saving
            const salt = await bcrypt.genSalt(10);
            customer.password = await bcrypt.hash(customer.password, salt);
            await customer.save();
            res.status(201).json({ message: 'Customer added successfully', customer });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Retrieve all Customers
    async getCustomers(req, res) {
        try {
            const customers = await Customer.find();
            res.json(customers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Customer by ID
    async getCustomerById(req, res) {
        const { id } = req.params;
        try {
            const customer = await Customer.findById(id);
            if (!customer) return res.status(404).json({ message: 'Customer not found' });

            res.json(customer);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Retrieve a single Customer by Email
    async getCustomerByEmail(req, res) {
        try {
            const { email } = req.params;
            const customer = await Customer.findOne({ emailAddress: email });

            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            res.status(200).json(customer);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Update Customer
    async updateCustomer(req, res) {
        const { id } = req.params;

        try {
            let customer = await Customer.findById(id);
            if (!customer) return res.status(404).json({ message: 'Customer not found' });

            Object.assign(customer, req.body);

            await customer.save();
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Delete Customer
    async deleteCustomer(req, res) {
        const { id } = req.params;

        try {
            const customer = await Customer.findByIdAndDelete(id);
            if (!customer) return res.status(404).json({ message: 'Customer not found' });

            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Login Customer
    async login(req, res) {
        const { email, password } = req.body;

        try {
            const customer = await Customer.findOne({ emailAddress: email });
            if (!customer) return res.status(404).json({ message: 'Customer not found' });

            // Check if the password matches
            const isMatch = await bcrypt.compare(password, customer.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            // Create and sign JWT token
            const token = jwt.sign(
                { id: customer._id, email: customer.emailAddress },
                process.env.JWT_SECRET, // Store this secret in an environment variable
                { expiresIn: '1h' } // Token expiration time
            );

            res.status(200).json({ token, email: customer.emailAddress });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CustomerController();
