const sequelize=require('./util/database');
const admin=require('./routes/admin');

const express = require('express');

const cors=require('cors');

const bodyParser = require('body-parser');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(admin);


sequelize.sync().then(()=>{
app.listen(3000,()=>{
    console.log("App listening on PORT 3000!")
})
}).catch(err=>console.log(err));

