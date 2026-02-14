import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { betterAuth } from 'better-auth'
import { username } from 'better-auth/plugins/username'

const dbPath = join(process.cwd(), 'data', 'auth.db')
mkdirSync(dirname(dbPath), { recursive: true })

const db = new DatabaseSync(dbPath)

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL || 'https://brain.onniworks.com',
  basePath: '/api/auth',
  secret:
    process.env.BETTER_AUTH_SECRET ||
    'dev-only-change-me-dev-only-change-me',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
  ],
})
