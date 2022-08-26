
/* login.js */

import { customiseNavBar, showMessage } from './browserUtility.js'

export async function setup() {
	console.log('LOGIN: setup')
// 	document.querySelector('h1').innerText = 'Login'
	customiseNavBar(['register', 'login'])
	document.querySelector('form').addEventListener('submit', await login)
}

async function login() {
	event.preventDefault()
		console.log('form submitted')
		const token = getToken()
        console.log(`token is ${token}`)
		const url = 'api/v1/account'
		const options = {
			method: 'GET',
			headers: { 'Authorization': token }
		}
        console.log(`token is ${token}`)
		const response = await fetch(url, options)
		const json = await response.json()
		if(response.status === 200) {
			localStorage.setItem('username', json.data.username)
			localStorage.setItem('authorization', token)
			window.location.href = '#home'
			showMessage(`you are logged in as ${json.data.username}`)
		} else {
			showMessage('invalid username or password')
			document.querySelector('input[name="pass"]').value = ''
		}
}

function getToken() {
	const formData = new FormData(event.target)
	const data = Object.fromEntries(formData.entries())
	console.log(data)
	const token = btoa(`${data.user}:${data.pass}`)
	return `Basic ${token}`
}
