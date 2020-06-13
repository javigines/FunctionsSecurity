module.exports = {
	helloWorld() {
		return new Promise((resolve, reject) => {
			return resolve('Hello World')
		})
	},
	helloWorldObject() {
		return new Promise((resolve, reject) => {
			return resolve({r: 'Hello World'})
		})
	},
	functionWithParams(params) {
		return new Promise((resolve, reject) => {
			return resolve({...{r: 'Hello World'}, ...params})
		})
	},
}
