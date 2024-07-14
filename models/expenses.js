const mongoose=require('../util/database');
const Schema = mongoose.Schema;
const User = require('./users'); // Import the Users model

const expenseSchema = new Schema({
    expense: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true  // Optional: Adds createdAt and updatedAt fields
});

const Expense = mongoose.model('Expense', expenseSchema);

if(Expense){
    console.log("collection is created");
}else{
    console.log("Collection is not created");
}

module.exports = Expense;
