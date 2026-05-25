const express=require('express');

const authRouter=require('./routes/auth.routes');
const accountRouter=require('./routes/account.routes');
const transactionRoutes=require('./routes/transaction.routes');

const cookieParser=require('cookie-parser');


const app=express();

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Welcome to the Bank Transaction System API');
});

app.use('/api/auth',authRouter);
app.use('/api/accounts',accountRouter);
app.use('/api/transactions',transactionRoutes);

module.exports=app;