const expenseTable=require('../models/expenses');



exports.getExpenses = (req, res, next) => {
    expenseTable.findAll()
        .then(expenses => {
            //console.log(expenses);
            let expen=expenses.map(i=>{
                return i.dataValues});
            res.status(200).json(expen); // Return all expenses as JSON
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


exports.addExpense = (req, res, next) => {
    const obj = {
        expense: req.body.expense,
        description: req.body.description,
        category: req.body.category,
        userId: req.body.userId // Assuming userId is passed in the request body
    };

    expenseTable.create(obj)
        .then(expense => {
            res.status(201).json(expense); // Return the created expense record
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};