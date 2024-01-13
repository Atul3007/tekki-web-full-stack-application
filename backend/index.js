const express = require ('express');
const connection = require("./config/db")
const app = express();

const cors = require("cors"); 
require('dotenv').config();

app.use(express.json());

app.use( 
  cors()
);

const port = process.env.PORT; 
const menuRouter = require("./routes/menuRoute");

app.get("/",(req,res)=>{
    res.send("Well Come !!!")
})

app.use("/menu",menuRouter);

app.listen(port, async () => {
    try {
      await connection;
      console.log("Connected to db");
    } catch (error) {
      console.log("Error occurred");
    }
    console.log(`Running on ${port}`);
  });
  