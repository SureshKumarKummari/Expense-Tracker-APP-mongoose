const express=require('express');
const router=express.Router();

const userauth=require('../middleware/userauthentication');

const purchasecontroller=require('../controllers/purchase');

router.get('/premiummembership',userauth.authenticate,purchasecontroller.purchasePremium);


router.post('/transactionupdate',userauth.authenticate,purchasecontroller.transactionUpdate);

module.exports=router;