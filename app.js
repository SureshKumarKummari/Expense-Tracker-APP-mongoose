//Database
const sequelize=require('./util/database');
const expenses=require('./models/expenses');
const users=require('./models/users');

//Routers
const admin=require('./routes/admin');
const handleexpenses=require('./routes/expenses');

const express = require('express');

const cors=require('cors');

const bodyParser = require('body-parser');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(admin);

app.use(handleexpenses);

sequelize.sync().then(()=>{
app.listen(3000,()=>{
    console.log("App listening on PORT 3000!")
})
}).catch(err=>console.log(err));

