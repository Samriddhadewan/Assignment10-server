require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middlewares
app.use(cors);
app.use(express());

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@phassignment.y94e1.mongodb.net/?retryWrites=true&w=majority&appName=phAssignment`;


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run(){
    try{
        console.log("successfully Connected to mongoDB")
    }
    catch(error){
        console.log(error)
    }
}
run();


app.listen(port,()=> {
    console.log(`A server side express is running in port${port}`)
})
