const f = require('../modules/helloWorld')

module.exports = {
	paths: {
		userFunctionsPath: '/users/{userID}/functions/'
	},

	functionsMap: {
		0: {
			f: f.helloWorld,
			e: 'global',
		},
		1: {
			f: f.helloWorld,
			e: 'none',
		},
		2: {
			f: f.helloWorld,
			e: 'aes128',
		},
		3: {
			f: f.helloWorld,
			e: 'aes256',
		},
		// 10000: {
		// 	f: f.helloWorld,
		// 	e: "global"
		// },
		// "hello": {
		// 	f: f.helloWorld,
		// 	e: "global"
		// }
	},

	encryption: {
		type: 'aes256', // none, aes128, aes256
		userPersonalized: false,
	},
}
