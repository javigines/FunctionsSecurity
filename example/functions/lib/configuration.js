const f1 = require('../modules/firstResponseSet')
const f2 = require('../modules/otherResponses')

module.exports = {
	paths: {
		userFunctionsPath: '/users/{userID}/functions/',
	},

	functionsMap: {
		0: {
			f: f1.helloWorld,
			e: 'global',
		},
		1: {
			f: f1.helloWorld,
			e: 'none',
		},
		2: {
			f: f1.helloWorld,
			e: 'aes128',
		},
		3: {
			f: f1.helloWorld,
			e: 'aes256',
		},
		10: {
			f: f1.helloWorldObject,
			e: 'global',
		},
		11: {
			f: f2.noResponseUndefined,
			e: 'global',
		},
		12: {
			f: f2.noResponseNull,
			e: 'global',
		},
		13: {
			f: f2.errorResponse,
			e: 'global',
		},
		14: {
			f: f1.functionWithParams,
			e: 'global',
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
		type: 'none', // none, aes128, aes256
		userPersonalized: false,
	},
}
