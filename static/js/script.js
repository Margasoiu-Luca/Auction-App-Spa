
/* scripts.js */

import { highlightNav } from './browserUtility.js'

document.addEventListener('DOMContentLoaded', async() => {
	console.log('DOM CONTENT LOADED')
	await router()
	window.addEventListener('hashchange', async() => router())
})

async function router() {
	console.log('HASH CHANGED')
	const [route, data] = location.hash.split('-')
	console.log(`${route} - ${data}`)
	const requestedPage = route ? route.replace('#', '') : 'home'
	console.log(`page: ${requestedPage}`)
	const querystring = data ? extractQuerystring(data) : {}
	console.log(querystring)
// 	document.querySelector('h1').innerHTML = '&nbsp;'
	document.querySelector('main').innerHTML = await (await fetch(`./html/${requestedPage}.html`)).text()
	highlightNav(requestedPage)
	try {
		const script = `../js/${requestedPage}.js`
		console.log(`trying to load script: ${script}`)
		const module = await import(script)
		console.log(`script found for "${requestedPage}" route`)
		module.setup(requestedPage)
	} catch(err) {
		console.warn(`no script for "${requestedPage}" route`)
	}
}

function extractQuerystring(data) {
	return data.split('&').reduce((acc, data) => {
		const [key, val] = data.split('=')
		acc[key] = val
		return acc
	}, {})
}

// function defaultHandler() {return false}
// function silentHandler()  {return true}