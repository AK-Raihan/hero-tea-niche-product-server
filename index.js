const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const { json } = require('express');

const port = process.env.PORT || 5000;

// middlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9idnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
      await client.connect();
      console.log('database connected successfully');
      const database = client.db('hero_tea');
      const teaCollection = database.collection('products');
      const ordersCollection = database.collection('orders');
      const reviewCollection = database.collection('review');
      const usersCollection = database.collection('users');
      const ratingCollection = database.collection('rating');


    // add product post api
    app.post("/addProduct", async (req, res) => {
      const result = await teaCollection.insertOne(req.body);
      res.send(result);
    });  

    //Product get api
    app.get('/shop', async (req, res) => {
        const cursor = teaCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    });

    // single product get api
    app.get("/singleProduct/:id", async (req, res) => {
        const result = await teaCollection.find({ _id: ObjectId(req.params.id) })
          .toArray();
        res.send(result[0]);
      });

    // cofirm order post
    app.post("/confirmOrder", async (req, res) => {
      console.log(req.body);
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
    });

    // get orders api
    app.get('/myOrder', async(req, res)=>{
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // my orders
    app.get('/myOrder/:email', async(req, res)=>{
      const result = await ordersCollection.find({ email: req.params.email})
      .toArray();
      console.log(result);
      res.send(result);
    });
    

    // deleted order
    app.delete("/delteOrder/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({_id: ObjectId(req.params.id),});
      res.send(result);
    });
    // deleted product
    app.delete("/deleteProduct/:id", async (req, res) => {
      const result = await teaCollection.deleteOne({_id: ObjectId(req.params.id),});
      res.send(result);
    });

    // review post api
    app.post("/review", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    // review get api
    app.get('/review', async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
  });
  
  // admin
  app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
})

  // users info post api
  app.post('/users', async(req, res)=>{
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result);
  })

  //
  app.put('/users/admin', async(req, res)=>{
    const user = req.body;
    console.log('put', user)
    const filter = { email: user.email };
    const updateDoc = { $set: { role: 'admin' } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
  });

  // update status
  app.put('/updateStatus/:id', (req, res)=>{
    const id = req.params.id;
    const updateStatus = req.body.status;
    const filter = {_id: ObjectId(id)};
    console.log(updateStatus);
    ordersCollection.updateOne(filter, {
      $set: {status: updateStatus},
    })
    .then(result=>{
      res.send(result);
    });
  });

  //Rating POST
  app.post("/rating", async (req, res) => {
    const rating = req.body;
    const result = await reviewCollection.insertOne(rating);

    res.json(result);
  });
  //Rating GET
  app.get("/rating", async (req, res) => {
    const cursor = reviewCollection.find({});
    const result = await cursor.toArray();
    // const result = await ratingCollection.find(rating);

    res.send(result);
  });



    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello ! Welcome to hero tea')
})

app.listen(port, () => {
  console.log(`Hero Tea app listening at :${port}`)
})