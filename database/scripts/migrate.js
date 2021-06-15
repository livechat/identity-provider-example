const { Database } = require('sqlite3')
const { open } = require('sqlite')

async function seed() {
  const db = await open({
    filename: './database/db.sqlite',
    driver: Database,
  })

  await db.migrate({
    force: true,
    migrationsPath: './database/migrations',
  })

  await db.close()
}

seed()
