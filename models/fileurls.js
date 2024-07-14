const mongoose=require('../util/database');
const Schema = mongoose.Schema;


const fileUrlSchema = new Schema({
    link: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true  // Optional: Adds createdAt and updatedAt fields
});

const FileUrl = mongoose.model('FileUrl', fileUrlSchema);


if(FileUrl){
    console.log("collection is created");
}else{
    console.log("Collection is not created");
}

module.exports=FileUrl;