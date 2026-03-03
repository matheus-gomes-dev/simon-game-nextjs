import mongoose, { type Mongoose } from "mongoose";

/** Shape of the cached connection stored on the global object. */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Global cache to prevent multiple Mongoose connections
 * during serverless function invocations and Next.js hot reloads.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB via Mongoose using a cached connection.
 *
 * In development, Next.js hot reloads clear the Node.js module cache,
 * so we store the connection on `global` to avoid creating duplicate
 * connections on every reload.
 *
 * @returns The cached Mongoose instance.
 */
async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
