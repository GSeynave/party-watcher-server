import { MongoClient, ServerApiVersion } from "mongodb";
import { config } from "../../config.js";

const uri = config.MONGO_URI as string;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export async function getDb() {
  const connectedClient = await clientPromise;
  return connectedClient.db("party-watcher");
}
