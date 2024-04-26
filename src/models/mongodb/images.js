import { MongoClient,  ObjectId,  ServerApiVersion } from 'mongodb'
const uri = "mongodb+srv://artgoramain:4e1WGabS7lVM1bxN@artgoracluster.hddqj1v.mongodb.net/?retryWrites=true&w=majority&appName=ArtGoraCluster";

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
    return database.collection('images')
  } catch (error) {
    console.error('Error connecting to the database')
    console.error(error)
    await client.close()
  }
}

export class ImageModel {
  static async getAll () {
    const db = await connect()
    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    return db.findOne({ _id: objectId })
  }

  static async getByExpositorId ({ id }) {
    const db = await connect()
    return db.find({ expositorId: id }).toArray()
  }

  static async create ({ input }) {
    const db = await connect()

    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const db = await connect()
    const objectId = new ObjectId(id)
    const { deletedCount } = await db.deleteOne({ _id: objectId })
    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connect()
    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnNewDocument: true })

    if (!ok) return false

    return value
  }

  // Crear un método para obtener 5 artistas, 4 aleatorios y 1 el ultimo creado
  static async getFive () {
    const db = await connect()
    const images = await db.find({}).toArray()
    if (images.length <= 5) return images;
    const randomImages = images.sort(() => Math.random() - Math.random()).slice(0, 4)
    const lastImage = images[images.length - 1]
    return [...randomImages, lastImage]
  }
}