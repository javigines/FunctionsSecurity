const f = require('../modules/helloWorld')

module.exports = {
	paths: {
		userFunctionsPath: '/users/{userID}/functions/',
		userEncryptionKeyPath: '/users/{userID}/functions/encryptionKey' // Only used on userPersonalized encryption
	},

	functionsMap: {
		0: f.helloWorld,
		// 10000: f.helloWorld,
		// "hello": f.helloWorld
	},

	encryption: {
		type: 'aes128', // none, aes128, aes256
		userPersonalized: false
	}
}
