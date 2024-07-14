const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User=require('../models/users');

// Initialize Razorpay instance
const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Purchase premium function
exports.purchasePremium = (req, res, next) => {
    const amount = 2500;
    rzp.orders.create({ amount, currency: 'INR' }, (err, razorpayOrder) => {
        if (err) {
            return next(new Error(JSON.stringify(err)));
        }
        console.log("In purchase2",razorpayOrder.id,rzp.id);
        // Create an order for the user
        Order.create({ orderid: razorpayOrder.id, status: "PENDING" })
            .then((order) => {
                console.log("In purchase3");
                // Assuming req.user is available with user details
                req.user.ispremiumuser = true; // Set user to premium
                req.user.save()
                    .then(() => {
                        console.log("In purchase4");
                        res.status(201).json({ order: razorpayOrder, key_id: rzp.key_id });
                    })
                    .catch(err => next(new Error(err)));
            })
            .catch(err => next(new Error(err)));
    });
};

// Transaction update function
exports.transactionUpdate = (req, res, next) => {
    const { order_id, payment_id, status } = req.body;

    // Find the order by orderid
    Order.findOne({ orderid: order_id })
        .then(order => {
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found!" });
            }

            // Update order details
            order.paymentid = payment_id;
            order.status = status;

            order.save()
                .then(() => {
                    // Update user to premium (assuming req.user is available)
                    req.user.isPremiumUser = true; // Set user to premium
                    req.user.save()
                        .then(() => {
                            res.status(202).json({ success: true, message: "Transaction Successful!" });
                        })
                        .catch(err => next(new Error(err)));
                })
                .catch(err => next(new Error(err)));
        })
        .catch(err => next(new Error(err)));
};
