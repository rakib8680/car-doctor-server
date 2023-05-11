const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middlewareWrapper 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crku76a.mongodb.net/?retryWrites=true&w=majority`;

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

        // select database 
        const serviceCollection = client.db('carDoctor').collection('services')
        const bookingCollection = client.db('carDoctor').collection('bookings')

        // get all data 
        app.get('/services', async (req, res) => {
            const service = serviceCollection.find()
            const result = await service.toArray();
            res.send(result);
        })

        // get single data 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { title: 1, price: 1, service_id: 1, img: 1, description: 1, }
            }
            const result = await serviceCollection.findOne(query, options);
            res.send(result);
        })


        // bookings 
        app.post('/bookings', async (req, res) => {
            const booking = req.body
            const result = await bookingCollection.insertOne(booking)
            res.send(result);

        });


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
    res.send('Welcome')
})

app.listen(port, (req, res) => {
    console.log(`car doctor listening on port ${port}`)
})