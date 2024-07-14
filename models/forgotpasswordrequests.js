const mongoose=require('../util/database');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true  // Optional: Adds createdAt and updatedAt fields
});

const ForgotPasswordRequest = mongoose.model('ForgotPasswordRequest', forgotPasswordSchema);

if(ForgotPasswordRequest){
    console.log("collection is created");
}else{
    console.log("Collection is not created");
}


module.exports=ForgotPasswordRequest;