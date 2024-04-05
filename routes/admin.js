const express=require('express');
const router=express.Router();

const admin=require('../controllers/admin');


router.get('/login/:email/:password',admin.login);


router.post('/signup',admin.signup);


module.exports=router;