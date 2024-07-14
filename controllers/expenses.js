const Razorpay = require('razorpay');
const User = require('../models/users');
const Expense = require('../models/expenses');
const FileUrl = require('../models/fileUrls');
const uploadtoaws=require('../util/uploadingtoaws');
// // Initialize Razorpay instance
 const rzp = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET
 });

exports.getExpenses = async (req, res, next) => {
     console.log('in else ');
    let userId = req.user.id;
    if (req.params.pagenumber) {
        const page = req.params.pagenumber || 1;
        const limit = Number(req.params.itemsperpage);
        console.log(page, limit);
        const skip = (page - 1) * limit;

        try {
            const expenses = await Expense.find({ userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: 'desc' });

            const count = await Expense.countDocuments({ userId });
            const totalpages = Math.ceil(count / limit);

            expenses.push({ lastpagenumber: totalpages });

            res.status(200).json(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        try {
            console.log('in else ');
            const expenses = await Expense.find({ userId });
            res.status(200).json(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.getLeaderboard = async (req, res, next) => {
    try {
        const usersExpenses = await User.find()
            .sort({ totalExpenses: 'desc' })
            .select('username totalExpenses');

        res.status(200).json(usersExpenses);
    } catch (error) {
        console.error('Error fetching user expenses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.addExpense = async (req, res, next) => {
    const { expense, description, category } = req.body;
    const userId = req.user.id;

    try {
        const expenseObj = new Expense({
            expense,
            description,
            category,
            userId
        });

        await expenseObj.save();

        // Update user's total expenses
        const user = await User.findById(userId);
        //user.totalExpenses += expense;
        user.totalExpenses += parseFloat(expense); // Ensure expense is parsed as a float or integer
        await user.save();

        res.status(201).json(expenseObj);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;

    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            throw new Error('Expense not found');
        }

        if (expense.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await expense.remove();

        // Update user's total expenses
        const user = await User.findById(userId);
        user.totalExpenses -= parseFloat(expense);
        await user.save();

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateExpense = async (req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });

        // If expense not found
        if (!updatedExpense) {
            throw new Error('Expense not found');
        }

        // If user is not authorized to update
        if (updatedExpense.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Update user's total expenses
        const user = await User.findById(userId);
        user.totalExpenses += (req.body.expense - updatedExpense.expense);
        await user.save();

        res.status(200).json(updatedExpense);
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.download = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        const stringifiedExpenses = JSON.stringify(expenses);

        // Upload expenses to S3
        const filename = `Expensesreport${getFormattedDate()}.txt`;
        const fileUrl = await uploadtoaws.uploadtoS3(stringifiedExpenses, filename);

        // Save file URL to database
        const fileUrlObj = new FileUrl({
            link: fileUrl,
            userId: req.user.id
        });
        await fileUrlObj.save();

        // Retrieve all file URLs for the user
        const allUrls = await FileUrl.find({ userId: req.user.id }).select('link createdAt');

        res.status(200).json(allUrls);
    } catch (err) {
        console.error('Error downloading expenses:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



function getFormattedDate(){
    const currentDate = new Date();

        // Get individual date components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
        return formattedDate; // Output: "2024-04-05-10-30-15" (for example)
}
