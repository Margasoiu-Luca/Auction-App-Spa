
import {customiseNavBar,addCard} from './browserUtility.js'

export async function setup() {
	const username = localStorage.getItem('username')
	console.log(`username: ${username}`)
	if(username === null) window.location.href = '#login'
	document.querySelector('main p').innerText = 'Your Items'
	customiseNavBar([ 'home', 'sell_item','logout'])
    getForUsername(localStorage.username)
}

async function getForUsername(username){
    
        const url = `api/v1/items/${username}`
        const options = {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('authorization')
            }
        }
        const response = await fetch(url, options)
        console.log("hello")
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