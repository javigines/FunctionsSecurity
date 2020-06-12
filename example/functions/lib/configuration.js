const f = require('../modules/helloWorld')

module.exports = {
	paths: {
		userFunctionsPath: '/users/{userID}/functions/',
	},

	functionsMap: {
		0: f.helloWorld,
		// 10000: f.helloWorld,
		// "hello": f.helloWorld
	},
}
