import { mkdirSync } from 'node:fs'
import { APIError } from 'better-auth/api'
import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'

const ALLOWED_EMAIL = 'digitaldave.eth@gmail.com'
const DB_DIR = process.env.NODE_ENV === 'production' ? '/app/data' : './data'
const DB_PATH = `${DB_DIR}/auth.db`

mkdirSync(DB_DIR, { recursive: true })
const db = new Database(DB_PATH)

// --- Synchronous table creation -------------------------------------------
// better-auth's getMigrations()/runMigrations() is async and unreliable
// at module-load time in Next.js production (the fire-and-forget promise
// either races with the first request or gets swallowed by the bundler).
// Because better-sqlite3 is synchronous we can guarantee the schema exists
// before any auth handler runs.
db.exec(`
  CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "session" (
    id TEXT PRIMARY KEY NOT NULL,
    expiresAt TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL REFERENCES "user"(id)
  );

  CREATE TABLE IF NOT EXISTS "account" (
    id TEXT PRIMARY KEY NOT NULL,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL REFERENCES "user"(id),
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    password TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "verification" (
    id TEXT PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  );
`)
// --------------------------------------------------------------------------

export const auth = betterAuth({
  database: db,
  baseURL:
    process.env.BETTER_AUTH_BASE_URL ||
    process.env.BETTER_AUTH_URL ||
    'https://brain.onniworks.com',
  basePath: '/api/auth',
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'dev-only-change-me-dev-only-change-me',
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: async (profile: { email?: string | null }) => {
        if (profile.email?.toLowerCase() !== ALLOWED_EMAIL) {
          throw new APIError('FORBIDDEN', {
            message:
              'Access denied: this Google account is not authorized for Pax Brain.',
          })
        }

        return {}
      },
    },
  },
})
