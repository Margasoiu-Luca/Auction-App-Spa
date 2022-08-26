/* home.js */

import {customiseNavBar,addCard} from './browserUtility.js'

export async function setup() {
	console.log('HOME')
	const username = localStorage.getItem('username')
	console.log(`username: ${username}`)
	if(username === null) window.location.href = '#login'
	document.querySelector('main p').innerText = 'Home Page'
	document.querySelector('main p').classList = 'hello'
	const nav = ['logout', 'sell_item','your_items']
	customiseNavBar(nav)
    getItems()
}


async function getItems(){
    
        const url = `api/v1/items`
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('authorization')
            }
        }
        const response = await fetch(url, options)
        console.log(response.status)
		const json = await response.json()
        try{
        json.data.records.map(x =>{
            console.log(x)
            addCard(x)})
        }
        catch(e){
//             console.log(e)
        }
        document.querySelector(".loader").remove()
}