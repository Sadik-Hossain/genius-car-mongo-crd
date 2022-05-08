const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

//*middleware
app.use(cors());
app.use(express.json());

//*============== mongodb ========================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7sao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("geniusCar").collection("service");

    //* ============== sob data anar api endpoint ==============
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const service = await cursor.toArray();
      // const service = await serviceCollection.find(query).toArray();
      res.send(service);
    });

    //* ==========particular data anar api endpoint==========
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    //* POST api
    app.post("/service", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    //* delete api | delete specific item
    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   console.log("genius car db connected");
//   // perform actions on the collection object
//   client.close();
// });

app.get("/", (req, res) => {
  res.send("running server");
});
app.get('/hero',(req,res)=>{
res.send('hero meets heroku')
})

app.listen(port, () => {
  console.log("listening to port", port);
});
