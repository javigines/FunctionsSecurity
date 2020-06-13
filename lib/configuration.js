
module.exports = {
	paths: {
		userFunctionsPath: '/users/{userID}/functions/',
	},

	functionsMap: {
		// 0: {
		// 	f: f1.helloWorld,
		// 	e: 'global',
		// },
		// 1: {
		// 	f: f1.helloWorld,
		// 	e: 'none',
		// },
		// 2: {
		// 	f: f1.helloWorld,
		// 	e: 'aes128',
		// },
		// 3: {
		// 	f: f1.helloWorld,
		// 	e: 'aes256',
		// },
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
		type: 'none', // none, aes128, aes256
		userPersonalized: false,
	},
}
