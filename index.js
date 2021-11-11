const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

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