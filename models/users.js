const mongoose=require('../util/database');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false
    },
    totalExpenses: {
        type: Number,
        default: 0
    }
});

const Users = mongoose.model('Users', userSchema);

if(Users){
    console.log("collection is created");
}else{
    console.log("Collection is not created");
}


module.exports = Users;

