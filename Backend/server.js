const express= require('express');
const bodyParser= require('body-parser');
const cors =require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(authRoutes);
const db_connect=process.env.DB_CONNECTION_STRING;
mongoose.connect(db_connect,{
    useNewUrlParser:true,
}).then(()=>{
    console.log('MongoDB connected Successfully')
})
;

app.listen(3000,()=>{
    console.log('App is running successfully')
})