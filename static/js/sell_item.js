
/* sell_item.js */

import { customiseNavBar, file2Base64, showMessage, file2DataURI } from './browserUtility.js'

export async function setup() {
	console.log('Sell-new-item')
	const username = localStorage.getItem('username')
	console.log(`username: ${username}`)
	if(username === null) window.location.href = '#login'
	document.querySelector('main p').classList= 'hello'
	document.querySelector('main p').innerText = 'Sell Item'
	const nav = ['logout', 'home','your_items']
	customiseNavBar(nav)
    document.querySelector('input[name="file"]').addEventListener('change', await displayImage)
	document.querySelector('form').addEventListener('submit', await uploadData)
}

async function uploadData(event) {
    event.preventDefault()
    const nameData=event.target.querySelector('input[name=ItemName]').value
    const descriptionData=event.target.querySelector('textarea').value
    const imageData=event.target.querySelector('input[name=file]').files[0]
    if(nameData==''||descriptionData==''||imageData==undefined){
        showMessage("You cannot add an item as you did not add all fields")
    }
    else{
        let formdata={
            name:nameData,
            description:descriptionData,
            date:new Date().toISOString().slice(0, 10)
        }
        formdata.image = await file2DataURI(imageData)
        console.log(formdata)
        const url = 'api/v1/items'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('authorization')
            },
            body: JSON.stringify(formdata)
        }
        const response = await fetch(url, options)
        if(response.status==201){
            showMessage("Sucessfully added an item")
        }
    }
    
}


async function displayImage(){
    const file = event.target.files[0]
    if(file){
        const data = await file2DataURI(file)
        console.log(`data uri is ${data}`)
        document.querySelector('form img').src=data
    }
}


    
//     //Uploading the image locally
// 	event.preventDefault()
// 	const element = document.querySelector('input[name="file"]')
// 	console.log(element)
// 	const file = document.querySelector('input[name="file"]').files[0]
// 	file.base64 = await file2Base64(file)
// 	file.user = localStorage.getItem('username')
// 	console.log(file)
// 	const url = '/files'
// 	const options = {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': localStorage.getItem('authorization')
// 		},
// 		body: JSON.stringify(file)
// 	}
// 	const response = await fetch(url, options)
// 	console.log(response)
// 	const json = await response.json()
// 	console.log(json)
// 	showMessage('file uploaded')
    
    
// 	const url = '/addItem'
// 	const options = {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': localStorage.getItem('authorization')
// 		},
// 		body: JSON.stringify(file)
// 	}



