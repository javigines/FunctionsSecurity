const functions = require('firebase-functions')
const crypto = require('crypto')

var request = require('request')
const config = require('./configuration')

let encryptionType
let encryptionKey128 = functions.config().encryption !== undefined ? functions.config().encryption.key128 : undefined
let encryptionKey256 = functions.config().encryption !== undefined ? functions.config().encryption.key256 : undefined

exports = module.exports = functions.database.ref(config.paths.userFunctionsPath + '/x').onCreate((snapshot, _context) => {
	const functionCode = snapshot.val()
	if (functionCode === '') return Promise.resolve()

	const execution = config.functionsMap[functionCode]
	if (execution === undefined) {
		return snapshot.ref.parent.update({
			r: "<NoFunction>",
			x: null,
			p: null,
		})
		.then(() => {
			return Promise.reject('Function Not Found')
		})
	}

	const functionExecute = execution.f
	encryptionType = execution.e !== 'global' ? execution.e : config.encryption.type

	let promises = [snapshot.ref.parent.child('p').once('value')]

	if (config.encryption.userPersonalized) {
		switch (encryptionType) {
			case 'aes128':
				promises.push(snapshot.ref.parent.child('k128').once('value'))
				break
			case 'aes256':
				promises.push(snapshot.ref.parent.child('k256').once('value'))
				break
		}
	}

	return Promise.all(promises)
		.then((response) => {
			const functionParams = response[0].val()

			if (config.encryption.userPersonalized) {
				switch (encryptionType) {
					case 'aes128':
						encryptionKey128 = response[1].val()
						break
					case 'aes256':
						encryptionKey256 = response[1].val()
						break
				}
			}

			return functionExecute(functionParams).catch((reason) => {
				console.log(reason)
				return Promise.resolve('FunctionExecutionError')
			})
		})
		.then((response) => {
			let finalResponse = response
			if (finalResponse === undefined || finalResponse === null) return Promise.resolve('<NoResponse>')
			if (finalResponse === 'FunctionExecutionError') return Promise.resolve('<ExecutionError>')

			if (typeof finalResponse === 'object') finalResponse = JSON.stringify(finalResponse)

			finalResponse = _encrypt(finalResponse)
			return _createResponseLink(finalResponse)
		})
		.then((responseDB) => {
			return snapshot.ref.parent.update({
				r: responseDB,
				x: null,
				p: null,
			})
		})
})

function _encrypt(response) {
	let finalResponse = String(response)

	switch (encryptionType) {
		case 'aes128':
			finalResponse = symetricalEncryption('aes-128-cbc', encryptionKey128, finalResponse)
			break
		case 'aes256':
			finalResponse = symetricalEncryption('aes-256-cbc', encryptionKey256, finalResponse)
			break
	}
	return finalResponse
}

function _createResponseLink(response) {
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
			code: response,
		},
	}

	return new Promise(function (resolve, reject) {
		request(options, function (error, response, _body) {
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
