require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //user: process.env.DB_USER,
    //pass: process.env.DB_PASSWORD
});

module.exports=mongoose;

