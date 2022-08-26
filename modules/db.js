
/* db.js */

import { Client } from 'https://deno.land/x/mysql/mod.ts'

const home = Deno.env.get('HOME')
console.log(`HOME: ${home}`)

const connectionData = {
  '/home/codio':  {
    hostname: '127.0.0.1',
    username: 'websiteuser',
    password: 'websitepassword',
    db: 'website'
  },
  '/app': {
		hostname: 'us-cdbr-east-03.cleardb.com',
    username: 'bddf8cf6f50082',
    password: 'b6892715',
    db: 'heroku_594c438a855d2c6'
  }
}

const conn = connectionData[home]
console.log(conn)

const db = await new Client().connect(conn)

export { db }
