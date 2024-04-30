const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USS3_BUCKET}:${process.env.SECRET_KEY}@cluster0.1mv6arg.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();



    const cardCollection = client.db('cardDB').collection('card');
    const countryCollection = client.db('countryDB').collection('country');


    app.get('/card', async( req, res) => {
         const cursor= cardCollection.find();
         const result = await cursor.toArray();
         res.send(result);
    })

    // counrty section

    app.get('/country', async( req, res) => {
      const cursor= countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
 })




   app.post('/card', async(req, res) => {
    const AddNewSpot=req.body;
    console.log(AddNewSpot);
    const result = await cardCollection.insertOne(AddNewSpot);
    res.send(result);
   });

// read email
   app.get('/card/:email',async (req, res) => {
    const email = req.params.email
    console.log(email);
    const query = {email:(email)};
    const result = await cardCollection.find(query).toArray()
    res.send(result)
  })

  // update
  app.get('/cards/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await cardCollection.findOne(query)
    res.send(result)
  })

  app.put('/card/:id',async (req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upset: true};
    const updatedSpot=req.body
    const spot = {
      $set: {
        cuntryname: updatedSpot.cuntryname,
        spotname: updatedSpot.spotname,
        averagecost: updatedSpot.averagecost,
        season:updatedSpot.season,
         photo: updatedSpot.photo,
         traveltime: updatedSpot.traveltime,
         totaVisitors: updatedSpot.totaVisitors,
         description: updatedSpot.description,
         location: updatedSpot.location
      }
    }

    const result = await cardCollection.updateOne(filter,spot, options);
    res.send(result)
  });


  // app.get('/carddetails/:id', async (req, res) => {
  //   const id = req.params.id;
  //   const query = {_id: new ObjectId(id)}
  //   const result = await cardCollection.findOne(query)
  //   res.send(result)
  // })




  // dellete Operation
  app.delete('/card/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id : new ObjectId (id)}
    const result = await cardCollection.deleteOne(query);
    res.send(result)
  })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})