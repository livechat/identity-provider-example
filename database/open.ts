import { Database } from 'sqlite3'
import { open } from 'sqlite'

export async function openDB() {
  return await open({
    filename: './database/db.sqlite',
    driver: Database,
  })
}
