const admin = require('firebase-admin')
admin.initializeApp()

exports['onUserCreation'] = require('./lib/accountCreationAddon')
exports['castFunctions'] = require('./lib/functionExecution')
