const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('./util/database'); // Connect to MongoDB using Mongoose

// Import Mongoose models
const User = require('./models/users');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// Set up middleware
app.use(helmet());

// Create a write stream (for logging)
const accessLogstream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogstream }));

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net");
    next();
});
// Example routes (replace with your actual routes)
const adminRouter = require('./routes/admin');
const handleExpensesRouter = require('./routes/expenses');
const purchaseRouter = require('./routes/purchase');

app.use(adminRouter);
app.use(handleExpensesRouter);
app.use(purchaseRouter);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on PORT ${port}!`);
});

