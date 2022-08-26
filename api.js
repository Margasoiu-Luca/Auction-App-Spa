
/* api.js */

// helpers are used to get the method parameters
import { Router ,helpers } from 'https://deno.land/x/oak@v6.5.1/mod.ts'

import { extractCredentials, saveFile,validateUserForMethod } from './modules/util.js'
import { login, register, checkIfExists} from './modules/accounts.js'

import {add,getAllItems,getFromUser} from './modules/items.js'

const apiRouter = new Router({ 
  prefix: "/api/v1"
})


apiRouter.get('/account', async context => {
	console.log('GET /accounts')
	try {
		const username = await validateUserForMethod(context.request.headers.get('Authorization'))
		context.response.body = JSON.stringify({ status: 'success', data: { username }}, null, 2)
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify({ status: 'unauthorised', msg: err.msg }, null, 2)
	}
})

apiRouter.post('/account', async context => {
    const JSONschema={
        user:"string",
        pass:"string"
    }
	console.log('POST /accounts')
	const body  = await context.request.body()
    const data = await body.value
    if(data.user==undefined||data.pass==undefined){
        context.response.status = 400
        context.response.body = JSON.stringify({ status: 'bad request', msg: 'user/pass not sent',JSONschema:JSONschema }, null, 2)
    }
    else{
	console.log(`create account data is:`+data.user+data.pass)
    const dbQueryResponse=await register(data)
    console.log('this is dbqu'+dbQueryResponse)
	if(dbQueryResponse==true){
        context.response.status = 201
        context.response.body = JSON.stringify({ status: 'success', msg: 'account created',JSONschema:JSONschema }, null, 2 )
        console.log('sucessful registered account')
    }
    else{
        console.log('failed registered account')
        context.response.status = 500
        context.response.body = JSON.stringify({ status: 'Internal Server Error', msg: 'username already used',JSONschema:JSONschema }, null, 2 )
    }
        
    }
})

apiRouter.post('/files', async context => {
	console.log('POST /files')
	try {
		const token = context.request.headers.get('Authorization')
		console.log(`auth: ${token}`)
		const body  = await context.request.body()
		const data = await body.value
		console.log(data)
		saveFile(data.base64, data.user)
		context.response.status = 201
		context.response.body = JSON.stringify({ status: 'success', msg: 'file uploaded' }, null, 2 )
	} catch(err) {
		context.response.status = 401
		context.response.body = JSON.stringify({ status: 'unauthorised', msg: err.msg }, null, 2 )
	}
})

apiRouter.post('/items', async context => {
    const JSONschema={
        username:"string",
        description: "string",
        image: "base64 encoded image as a string",
        date: "YYYY-MM-DD"
    }
	console.log('POST /Item')
    let user = {}
	try {
        user = await validateUserForMethod(context.request.headers.get('Authorization'))
        const body  = await context.request.body()
        const data = await body.value
        console.log(data.name,data.description,data.date)
        if(data.name==undefined||data.description==undefined||data.image==undefined||data.date==undefined){
            
            context.response.status = 400 
            context.response.body = JSON.stringify({ status: 'Bad Request', msg: 'one of the values has been omitted',JSONschema:JSONschema}, null, 2 )
        }
        else{
            
            console.log("user is "+user)
            data.usrname=user
            console.log(data)
            const msg = await add(data)
            if(msg==true){
                context.response.status = 201
                context.response.body = JSON.stringify({ status: 'success', msg: 'item successfully added',JSONschema:JSONschema })
            }
            else{
                context.response.status = 500
                context.response.body = JSON.stringify({ status: 'Internal database error',msg ,JSONschema:{JSONschema} }, null, 2 )
            
            }
        } 
    }
    catch(err) {
    context.response.status = 401
    context.response.body = JSON.stringify({ status: 'unauthorised', msg: err.msg }, null, 2 )
	}
    
})


apiRouter.get('/items', async context  => {
    try{
        await validateUserForMethod(context.request.headers.get('Authorization'))
        const records= await getAllItems()
        console.log(records)
        context.response.status = 200
        context.response.body = JSON.stringify({ status: 'ok', data:{records} }, null, 2 )
    }
    catch(err){
        context.response.status = 401
        context.response.body = JSON.stringify({ status: 'unauthorised', msg: err.msg }, null, 2 )
    }
})

apiRouter.get('/items/:username',async context => {
	console.log('get/item/username')
    const { username } = helpers.getQuery(context, { mergeParams: true });
//     console.log(`username is ${username}`)
    try{
        await validateUserForMethod(context.request.headers.get('Authorization'))
        const records= await getFromUser(username)
        const checkUserCreated= await checkIfExists(username)
        console.log(checkUserCreated)
        if(checkUserCreated==false){
            console.log(checkUserCreated)
            //alternative would have been to use 204
//             context.response.status = 204
            context.response.status = 206 
            context.response.body = JSON.stringify({ status: 'Partial Content',msg:`username ${username} does not exist`}, null, 2 )
        }
        else{
            //Check if the array is empty, if so means that this user has no data
            if(!(Array.isArray(records)&& records.length)){
            context.response.status = 206 
            context.response.body = JSON.stringify({ status: 'Partial Content',msg:`no items for ${username}`}, null, 2 )
            }
            else{
            context.response.status = 201 
            context.response.body = JSON.stringify({ status: 'ok',msg:"data found", data:{records} }, null, 2 )
            }
        }
    }
    catch(err){
        context.response.status = 401
        context.response.body = JSON.stringify({ status: 'unauthorised', msg: err.msg }, null, 2 )
    }    
//    console.log(records)
});

apiRouter.get("/(.*)", async context => {
    context.response.status=404
	context.response.body = JSON.stringify({ status: 'not found', msg:'get method does not exist'}, null, 2 )
})

apiRouter.post("/(.*)", async context => {
    context.response.status=404
	context.response.body = JSON.stringify({ status: 'not found', msg:'post method does not exist'}, null, 2 )
})






















export default apiRouter



// router.post('/addItem', async context => {
// 	console.log('POST /addItem')
//     const {value} = context.request.body({type:'json'})
//     const data = await value
//     console.log("data is"+data)
//     const credentials = await extractCredentials(context.request.headers.get('Authorization'))
//     console.log(credentials)
// //     user = await login(credentials)
    
//     console.log("user is"+user)
// 		context.response.status = 201
// 		context.response.body = JSON.stringify({ status: 'success', msg: 'file uploaded' })
// })
