const functions = require('firebase-functions')
const crypto = require('crypto')

var request = require('request')
const config = require('./configuration')

const encryptionKey128 = functions.config().encryption.key128
const encryptionKey256 = functions.config().encryption.key256

exports = module.exports = functions.database.ref(config.paths.userFunctionsPath + '/x').onCreate((snapshot, context) => {
	const functionCode = snapshot.val()
	if (functionCode === '') return Promise.resolve()

	const functionExecute = config.functionsMap[functionCode]
	if (functionExecute === undefined) return Promise.reject('Function Not Found')

	return snapshot.ref.parent
		.child('p')
		.once('value')
		.then((params) => {
			const functionParams = params.val()

			console.debug(functionCode)
			console.debug(functionParams)

			return functionExecute(functionParams)
		})
		.then((response) => {
			return _createResponseLink(response)
		})
		.then((responseLink) => {
			return snapshot.ref.parent.set({
				r: responseLink,
			})
		})
})

function _createResponseLink(response) {
	let finalResponse = String(response)

	switch (config.encryption.type) {
		case 'aes128':
			finalResponse = symetricalEncryption('aes-128-cbc', encryptionKey128, finalResponse)
			break
		case 'aes256':
			finalResponse = symetricalEncryption('aes-256-cbc', encryptionKey256, finalResponse)
			break
	}

	var options = {
		method: 'POST',
		url: 'http://snippi.com/add',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		form: {
			title: '',
			language: 'plain',
			expiration: '+10 minutes',
			code: finalResponse,
		},
	}

	return new Promise(function (resolve, reject) {
		request(options, function (error, response, body) {
			if (error) return reject(error)
			let extractedURL = response.headers['refresh'].split(';url=')[1]
			let rawURL = extractedURL.replace('/s/', '/raw/')

			try {
				return resolve(rawURL)
			} catch (e) {
				console.log(e)
				return reject(e)
			}
		})
	})
}

function symetricalEncryption(algorithm, key, text) {
	let iv = crypto.randomBytes(16)
	let cipher = crypto.createCipheriv(algorithm, key, iv)
	let encrypted = cipher.update(text, 'utf8')
	encrypted = Buffer.concat([encrypted, cipher.final()])
	return iv.toString('hex') + '.' + encrypted.toString('hex')
}
