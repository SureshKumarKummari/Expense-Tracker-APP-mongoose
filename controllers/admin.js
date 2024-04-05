const users=require('../models/users');


exports.signup=(req,res,next)=>{
    users.findByPk(req.params.email)
    .then(user=>{
        if(!user){
            return users.create({
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password
            })
        }else{
            res.status(409).json({error:'User already exists!'})
            //res.status(409).send({error:'User already exists!'});  14 & 15 both are same Just 14 will sends JSON only while 15 will all types of responses like html JSON plain text

        }
    }).then(user=>{
        res.send(user.dataValues);
    }).catch(err=>console.log(err));
}


exports.login=(req,res,next)=>{
    users.findOne({where :{email: req.params.email}})
    .then(user=>{
        console.log(user.dataValues);
        res.send(user);
    }).catch(err=>console.log(err));    

}