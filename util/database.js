const Sequelize=require('sequelize');

const db=new Sequelize('expenses','root','SUresh@1289',{
    dialect:'mysql',
    host: 'localhost'
});

module.exports=db;