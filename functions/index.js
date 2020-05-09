const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp()

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
    .onCreate((change, context) => {

        return change.after.ref.parent.child("p").once("value")
            .then((params) => {

                const functionCode = change.after.val()
                const functionParams = params.val()

                console.log(functionCode)
                console.log(functionParams)

                return change.after.ref.parent.set({
                    r: "http://google.com"
                })
            })

});