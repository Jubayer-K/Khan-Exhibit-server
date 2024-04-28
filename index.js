const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bv8l8yc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const craftCollection =client.db('addCraftDB').collection('crafts');
    // const userCollection = client.db('addCraftDB').collection('user');
    const subcategoryCollection = client.db('addCraftDB').collection('subcategory');

    app.get('/add-craft',async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/add-craft/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.findOne(query)
      res.send(result);
    })


    app.get("/my-art/:email", async (req, res) => {
      const result = await craftCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })
   
    app.put('/add-craft/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true};
      const updatedCraft = req.body;
      const craft ={
        $set :{
          itemName : updatedCraft.itemName,
          image : updatedCraft.image,
          subcategoryName : updatedCraft.subcategoryName,
          description : updatedCraft.description,
          price : updatedCraft.price,
          rating : updatedCraft.rating,
          customization : updatedCraft.customization,
          time : updatedCraft.time,
          stock : updatedCraft.stock 
        }
      }
      const result = await craftCollection.updateOne(filter,craft,options)
      res.send(result);
    })

    app.post('/add-craft',async(req , res)=>{
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })

    app.delete('/add-craft/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query)
      res.send(result);
    })

    //  subcategory related APIs
    app.get('/subcategory',async(req,res)=>{
      const cursor = subcategoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/subcategory',async(req,res)=>{
      const subcategory = req.body;
      const result = await subcategoryCollection.insertOne(subcategory);
      res.send(result);
    });

    app.get('/subcategory/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await subcategoryCollection.findOne(query)
      res.send(result);
    })



    // user related APIs

    // app.post('/user',async(req,res)=>{
    //   const user = req.body;
    //   console.log(user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req , res)=>{
    res.send('khan exhibit server is running')
})

app.listen(port , ()=>{
    console.log(`Khan exhibit server is running on port :${port}`);
})