import { MongoClient } from "mongodb";

/**
 * Global cache for the native MongoClient, used by Auth.js adapter.
 * Prevents creating multiple connections during Next.js hot reloads.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const options = {};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the client is preserved
  // across hot reloads.
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each serverless instance.
  const client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;
