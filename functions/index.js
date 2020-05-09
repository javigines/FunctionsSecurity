const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

var request = require('request');

const config = require("./config")
const db = admin.database()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.onUserCreation = functions.auth.user()
.onCreate((user) => {
	
	let userFunctionsFinalPath = config.paths.userFunctionsPath
	.replace("{userID}", user.uid)
	.replace("{userEmail}", user.email)
	.replace("{userPhone}", user.phoneNumber)
	
	return db.ref(userFunctionsFinalPath).set({
		"x": "",
		"p": {}
	})
	
})

exports.castFunctions = functions.database.ref(config.paths.userFunctionsPath + "/x")
.onCreate((snapshot, context) => {
	
	return snapshot.ref.parent.child("p").once("value")
	.then((params) => {
		
		const functionCode = snapshot.val()
		const functionParams = params.val()
		
		console.log(functionCode)
		console.log(functionParams)
		
		return Promise.resolve(Date.now())
	})
	.then((response) => {
		return createResponseLink(response)
	})
	.then((responseLink) => {
		
		return snapshot.ref.parent.set({
			r: responseLink
		})
	})
	
});

function createResponseLink(response) {
	var options = {
		'method': 'POST',
		'url': 'http://snippi.com/add',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		form: {
			'title': '',
			'language': 'plain',
			'expiration': '+10 minutes',
			'code': String(response)
		}
	};
	
	return new Promise(function (resolve, reject) {
		request(options, function (error, response, body) {
			if (error) return reject(error);
			console.log( response.headers )
			console.log( response.headers["refresh"] )
			console.log( response.headers["refresh"].split(";url=")[1] )
			let extractedURL = response.headers["refresh"].split(";url=")[1]
			let rawURL = extractedURL.replace("/s/", "/raw/")
			
			try {
				return resolve( rawURL );
			} catch (e) {
				console.log(e)
				return reject(e);
			}
		});
	});
}