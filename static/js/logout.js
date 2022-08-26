
/* logout */

export async function setup() {
	console.log('LOGOUT')
	localStorage.removeItem('username')
	localStorage.removeItem('authorization')
	window.location.href = '#login'
}
