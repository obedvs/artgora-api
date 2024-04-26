import { MongoClient,  ObjectId,  ServerApiVersion } from 'mongodb'
const uri = "mongodb+srv://" + process.env.MONGODB_USER + ":" + process.env.MONGODB_PASSWORD + "@artgoracluster.hddqj1v.mongodb.net/?retryWrites=true&w=majority&appName=ArtGoraCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()
    const database = client.db('artgora-db')
    return database.collection('admins')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class AuthModel {

  static async findOne ({ email }) {
    const db = await connect()
    return db.findOne({ email: email });
  }

  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const result = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })
    if (!result) { return false }
    else { return true }
  }
}