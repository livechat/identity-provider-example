const { Database } = require('sqlite3')
const { open } = require('sqlite')

async function print() {
  const table = process.argv[2]
  if (!table) {
    console.log("Provide 'table name' as an arguemnt")
    process.exit(1)
  }

  const db = await open({
    filename: './database/db.sqlite',
    driver: Database,
  })

  const rows = await db.all(`select * from ${table}`)
  console.log(`\n===== ${table} =====\n`, JSON.stringify(rows, null, 2))

  await db.close()
}

print()
