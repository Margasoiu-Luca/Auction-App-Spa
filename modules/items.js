import { db } from './db.js'

export async function add(values) {
    try{
        console.log(values)
        const sql = `INSERT INTO items(name, description,image,dateof,acName) VALUES("${values.name}",
        "${values.description}",
        "${values.image}",
        "${values.date}",
        "${values.usrname}")`
//         console.log(sql)
        const results = await db.query(sql)
        return true
    }
    catch(e){
        return e.message
    }
}

export async function getFromUser(username) {
    console.log(username)
	const sql = `SELECT name,description,image,dateof FROM items WHERE acname = "${username}";`
	console.log(sql)
	const results = await db.query(sql)
	return results
}

export async function getAllItems() {
	const sql = `SELECT * FROM items`
	console.log(sql)
	const results = await db.query(sql)
	return results
}
