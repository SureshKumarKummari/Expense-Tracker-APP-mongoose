const express=require('express');
const expense=require('../controllers/expenses');

const router=express.Router();

router.get('/getExpenses',expense.getExpenses);

router.post('/addExpense',expense.addExpense);


module.exports=router;