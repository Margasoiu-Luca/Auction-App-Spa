
/* accounts.js */

import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'
import { db } from './db.js'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export async function login(credentials) {
	const { user, pass } = credentials
	let sql = `SELECT count(user) AS count FROM accounts WHERE user="${user}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${user}" not found`)
	sql = `SELECT pass FROM accounts WHERE user = "${user}";`
	records = await db.query(sql)
	const valid = await compare(pass, records[0].pass)
    console.log('credentials are '+ valid)
	if(valid === false) throw new Error(`invalid password for account "${user}"`)
	return user
}

export async function register(credentials) {
	let sql, records
	sql = `SELECT * FROM accounts WHERE user="${credentials.user}";`
	records = await db.query(sql)
	if(records[0]!==undefined) return false
    
	credentials.pass = await hash(credentials.pass, salt)
	sql = `INSERT INTO accounts(user, pass) VALUES("${credentials.user}", "${credentials.pass}")`
	console.log(sql)
	records = await db.query(sql)
	return true
}

export async function checkIfExists(username){
    const sql =`SELECT * FROM accounts WHERE user = "${username}";`
	const records = await db.query(sql)
	if(records[0]==undefined) return false
    return true
}