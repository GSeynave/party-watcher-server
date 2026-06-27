import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "../../config.js";

const uri = config.MONGO_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectMongo() {
  console.log("Connecting to MongoDB...", uri);
  await client.connect();
}

export function getDb() {
  return client.db("party-watcher");
}
