
import { Router ,helpers } from 'https://deno.land/x/oak@v6.5.1/mod.ts'

import { extractCredentials, saveFile,validateUserForMethod } from './modules/util.js'
import { login, register, checkIfExists} from './modules/accounts.js'

import {add,getAllItems,getFromUser} from './modules/items.js'


const router = new Router()

// the routes defined here
router.get('/', async context => {
	const data = await Deno.readTextFile('static/index.html')
	context.response.body = data
})



router.get("/(.*)", async context => {      
	const data = await Deno.readTextFile('static/404.html')
    context.response.status=404
	context.response.body = data
})




export default router