const express =require ("express")
const dotenv = require('dotenv')
dotenv.config()
const  app=require('./app.cjs')
let sequelize=require('./config/db_config.cjs')
let port=3000;





(async()=>{
  try{
     await sequelize.sync({alter:true})
    await sequelize.authenticate();
   

    console.log("Connection has been established successfully ")
  }

      
  catch(error){
    console.error("Unable to connect to the Database",error)
  }})()

    app.listen(port,()=>{
  console.log("Server is working")
})
  
 
