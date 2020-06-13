module.exports = {
	noResponseNull() {
		return new Promise((resolve, reject) => {
			return resolve(null)
		})
	},
	noResponseUndefined() {
		return new Promise((resolve, reject) => {
			return resolve()
		})
	},
	errorResponse() {
		return new Promise((resolve, reject) => {
			return reject('Critical Error')
		})
	},
}
