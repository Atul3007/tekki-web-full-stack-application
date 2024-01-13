const mongoose=require("mongoose");
require('dotenv').config();
const connectDatabase = process.env.connection;

const connection =
mongoose.connect(connectDatabase)


module.exports={
    connection
} 