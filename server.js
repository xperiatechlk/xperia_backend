const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require("cors"); 0

dotenv.config();
const app = express();
const corsOptions = {
    origin: ['http://localhost:3000', 'https://xperia.vercel.app/'], // Add both local and deployed URLs
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
};

app.use(cors(corsOptions));


// Middleware
app.use(bodyParser.json());

// Database connection
const PORT = process.env.PORT || 8070;
const MONGODB_URI = process.env.MONGODB_URI;


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true },)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });

mongoose.connection.once("open", () => {
    console.log("Database Synced");
});

// Routes
const customerRoutes = require('./routes/Customer');
const staffRoutes = require('./routes/Staff');
const ticketRoutes = require('./routes/Ticket');
const departmentRoutes = require('./routes/Department');
const DashboardRoutes = require('./routes/Dashboard');
const ItemRoutes = require('./routes/Items');
const RepairRoutes = require('./routes/Repair');
const SallesRoutes = require('./routes/Salles');

app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/Dashboard', DashboardRoutes);
app.use('/api/items', ItemRoutes);
app.use('/api/repairs', RepairRoutes);
app.use('/api/sales', SallesRoutes);

// Start the server 
app.listen(PORT, () => {
    console.log('\n###################################')
    console.log(`Server is running on port -> ${PORT}`);
    console.log('\n- API end points -')
    console.log('\t-> api/customers')
    console.log('\t-> api/staff')
    console.log('\t-> api/tickets')
    console.log('\t-> api/departments')
    console.log('\t-> api/Dashboard')
    console.log('\t-> api/items')
    console.log('\t-> api/repairs')
    console.log('\t-> api/sales')
    console.log('###################################\n')
});

