import { mkdirSync } from 'node:fs'
import { APIError } from 'better-auth/api'
import { betterAuth } from 'better-auth'
import Database from 'better-sqlite3'

const ALLOWED_EMAIL = 'digitaldave.eth@gmail.com'
const DB_DIR = '/app/data'
const DB_PATH = `${DB_DIR}/auth.db`

mkdirSync(DB_DIR, { recursive: true })
const db = new Database(DB_PATH)

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || 'https://brain.onniworks.com',
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
      mapProfileToUser: async (profile) => {
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
