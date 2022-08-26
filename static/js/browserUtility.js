
/* browserUtility.js */

export function customiseNavBar(items) {
	document.querySelectorAll('nav li').forEach(element => {
		const link = element.querySelector('a')
		const [url, hash] = link.href.split('#')
		if(items.includes(hash)) {
			element.style.display = 'block'
		} else {
			element.style.display = 'none'
		}
	})
}

export function highlightNav(page) {
	document.querySelectorAll('nav li').forEach(element => {
		const link = element.querySelector('a')
		const [url, hash] = link.href.split('#')
		if(hash === page) {
			element.classList.add('currentpage')
		} else {
			element.classList.remove('currentpage')
		}
	})
}

export function showMessage(message, delay = 3000) {
	console.log(message)
	document.querySelector('aside p').innerText = message
	document.querySelector('aside').classList.remove('hidden')
	setTimeout( () => document.querySelector('aside').classList.add('hidden'), delay)
}

export function file2Base64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function file2DataURI(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function getURL() {
	const [currentURL, fragment] = window.location.href.split('#')
	return currentURL.substring(0, currentURL.length - 1)
}


export function addCard(item){
    let itemsOnScreen = document.querySelectorAll('.box')
    if(itemsOnScreen.length%4==0){
        let container= document.createElement("div")
        container.classList='container'
        document.querySelector('main').appendChild(container)
    }
    let box= document.createElement("div")
    box.classList='box'
    
    let image = document.createElement('img')
    image.classList='cardimage'
    image.src=item.image
    
    let name = document.createElement('h3')
    name.innerText=item.name
    
    let date = document.createElement('h3')
    date.innerText=item.dateof.slice(0,10)
    
    let desc = document.createElement("p")
    desc.classList='card-description'
    desc.innerText=item.description
    
    
    box.appendChild(image)    
    box.appendChild(name)
    if(item.acName!=undefined){
        let from = document.createElement('h3')
        from.innerText=`From user ${item.acName}`
        box.appendChild(from)
    }
    box.appendChild(date)    
    box.appendChild(desc)
    
    const containers = document.querySelectorAll('.container')
    containers[containers.length-1].appendChild(box)
//     console.log("hello")
}