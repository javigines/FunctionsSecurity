const functions = require('firebase-functions')

const config = require('./configuration')
const db = require('firebase-admin').database()



exports = module.exports = functions.auth.user().onCreate((user) => {
	let userFunctionsFinalPath = config.paths.userFunctionsPath
		.replace('{userID}', user.uid)
		.replace('{userEmail}', user.email)
		.replace('{userPhone}', user.phoneNumber)

	return db.ref(userFunctionsFinalPath).update({
		x: '',
		p: {},
	})
})