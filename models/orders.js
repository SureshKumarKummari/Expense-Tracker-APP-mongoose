const mongoose=require('../util/database');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    paymentid: { type: String, required: false },
    orderid: { type: String, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true  // Optional: Adds createdAt and updatedAt fields
});

const Order = mongoose.model('Order', orderSchema);

if(Order){
    console.log("collection is created");
}else{
    console.log("Collection is not created");
}

module.exports = Order;
