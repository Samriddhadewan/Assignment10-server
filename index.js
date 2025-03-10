require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewares
app.use(cors());
app.use(express.json());

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
      // await client.connect();
      // await client.db("admin").command({ ping: 1 });
      console.log("successfully Connected to mongoDB");

      const campaignDB = client.db("campaignDB").collection("campaigns")
      const campaignDonateDB = client.db("campaignDB").collection("campaignDonation")


      app.post("/campaigns", async(req, res)=>{
        const newCampaign = req.body;
        const result = await campaignDB.insertOne(newCampaign);
        res.send(result);
      })


      app.get("/campaigns", async(req, res)=>{
        const cursor = campaignDB.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.put("/campaigns/:id", async(req, res)=>{
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = {upsert : true}
        const updatedCampaign = req.body;
        const updateCampaign = {
          $set:{
            thumbnail : updatedCampaign.thumbnail,
            title: updatedCampaign.title,
            campaignType: updatedCampaign.campaignType,
            description:updatedCampaign.description,
            minimumAmount:updatedCampaign.minimumAmount,
            deadline: updatedCampaign.deadline
          }
        }
        const result = await campaignDB.updateOne(filter,updateCampaign, options)
        res.send(result);
      })


      app.get("/campaigns/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await campaignDB.findOne(query);
        res.send(result);
      })


      app.post("/donation", async(req, res)=>{
        const NewDonation = req.body;
        console.log(NewDonation)
        const result = await campaignDonateDB.insertOne(NewDonation);
        res.send(result)
      })

      app.get("/myDonation/:email", async(req, res)=>{
        const email = req.params.email;
        const query = campaignDonateDB.find({donatedUserEmail : email});
        const result = await query.toArray();
        res.send(result);
      })

      app.get("/myItems", async(req, res)=>{
          const query = campaignDB.find().limit(6);
          const result = await query.toArray();
          res.send(result)
      })

      app.get("/myCampaign/:email", async(req, res)=>{
        const email = req.params.email;
        const query = campaignDB.find({userEmail : email});
        const result = await query.toArray();
        res.send(result)
      })
      app.delete("/campaigns/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await campaignDB.deleteOne(query);
        res.send(result)
      })
    }
    catch(error){
        console.log(error)
    }
}
run();


app.get("/", (req, res)=>{
  res.send("server is running ")
})


app.listen(port,()=> {
    console.log(`A server side express is running in port${port}`)
})