const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
const port = 7000;


const db_user = env.process.user;
const db_pass = env.process.pass;

const uri = `mongodb+srv://${db_user}:${db_pass}@cluster0.dd4rb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        client.connect( async err => {
            const database = client.db("SuperShop");
            const collectionUser = database.collection("User");
            // CRUD = create, Read, Update, Delete

            // add new user
            app.post('/user', async (req, res) => {
                const user = req.body;
                const result = await collectionUser.insertOne(user);
                res.json(result);
            });

            // get all users
            app.get('/users', async (req, res) => {
                const query = {};
                const cursor = collectionUser.find(query)
                const result = await cursor.toArray();
                res.json(result);
            });

            // delete one user
            app.delete('/user', async (req, res) => {
                const {id} = req.body;
                const query = {_id: ObjectId(id)}
                const result = await collectionUser.deleteOne(query);
                if(result.deletedCount === 1) {
                    res.json(result)
                } else {
                    res.json({deletedCount: 0})
                }
            });

            // update one user
            app.put('/user/update', async (req, res) => {
                const {id, ...rest} = req.body;
                const filter = {_id: ObjectId(id)};
                const data = {
                    $set: rest
                }
                const options = { upsert: true };
                const result = await collectionUser.updateOne(filter, data, options)

                if(result.modifiedCount === 1) {
                    res.json(result)
                } else {
                    res.json({modifiedCount: 0})
                }
            });
          });
    } finally {

    }
}

run().catch(error => console.log(error))

app.get('/', (req, res) => {
    res.send("Working");
})

app.listen(port, () => {
    console.log("App is running", port);
})

