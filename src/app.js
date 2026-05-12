const express=require('express');


const app=express();

app.get('/',(req,res)=>{
    res.send('Welcome to the Bank Transaction System API');
});

module.exports=app;