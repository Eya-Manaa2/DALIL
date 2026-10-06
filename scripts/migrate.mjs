// Creates or updates every table the app needs: the app tables (lib/db/migrations/*.sql, idempotent)
// and the better-auth tables (user, session, account, verification), computed from the auth config.
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getMigrations } from 'better-auth/db/migration'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'db', 'migrations')

try {
  for (const file of (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()) {
    await pool.query(await readFile(path.join(dir, file), 'utf8'))
    console.log(`applied ${file}`)
  }

  // Must stay in sync with the database-relevant options of lib/auth.ts (no plugins, email + password).
  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations({
    database: pool,
    emailAndPassword: { enabled: true },
  })
  if (toBeCreated.length || toBeAdded.length) {
    await runMigrations()
    console.log(`better-auth: created ${toBeCreated.map((t) => t.table).join(', ') || 'none'}; updated ${toBeAdded.map((t) => t.table).join(', ') || 'none'}`)
  } else {
    console.log('better-auth: schema up to date')
  }
} finally {
  await pool.end()
}
