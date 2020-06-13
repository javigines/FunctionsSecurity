# Firebase Functions Security Add-on
Execution your Google Cloud Functions through a RTDB writing.

[Add-on Video](https://youtu.be/QUoi1udKFrw)

# Beneficies
- Extra security execution layer using Firebase RTDB Writting Rules.
- Prevent functions calls abuse. Which could cause invoice problems by functions calls.

# Quick RTDB fields guide
- `x` - Code of the function to execute & run execution. Removed once execution finish.
- `p` - (Optional) Params to attach to the function when executed. Removed once execution finish.
- `r` - Result of the last function execution. In case of result it will be a link, in case of non-result or error it would be `<NoResponse>` and `<ExecutionError>`

<br>

- `k128` - Encryption key in case of aes128 encryption and userPersonalized
- `k256` - Encryption key in case of aes256 encryption and userPersonalized


# Installation

1. Introduce the lib folder into your functions folder.
2. Configure the configuration file with your preferences.
3. Include the following line in your index file:
```
const admin = require('firebase-admin')
admin.initializeApp()

exports["castFunctions"] = require("./lib/functionExecution")
```
4. (Optional) If you want on new user creation it appears with the functions configuration in your RTDB, include the following line in your index file:
```
exports["onUserCreation"] = require("./lib/accountCreationAddon")
```
5. Add `request` dependency on `package.json`


# Configuration
- `paths` (Wildcards that will be replaced: _`{userID}`_, _`{userEmail}`_, _`{userPhone}`_)
    - `userFunctionsPath`: Specific user path that you want the library use for work.

- `functionsMap`: Map that indicate the code (entry point of the execution) as the key and the execution requirements.
    - `f`: Function to execute reference (It will need to import the functions modules into the configuration module).
    - `e`: Type of encryption to apply in the function response.

- `encryption`
    - `type`: Encryption type for response. Available types: `none`, `aes128`, `aes256`
    - `userPersonalized`
        - In case this is marked as `false`. The key must be stored on enviroment on _`encryption.key128`_ or _`encryption.key256`_ as required.
            ##### To save in enviroment use `firebase functions:config:set encryption.key128="THE ENCRYPTION KEY"` and deploy.

        - In case this is marked as `true`. The key will be read **IN EVERY FUNCTION CALL** (increased response times and reads from RTDB) from `userEncryptionKeyPath` in RTDB.

# Encryption with AES
Key need to be on set on _`encryption.key128`_ or _`encryption.key256`_ as required or in user space as _`k128`_ or _`k256`_ field.

##### [Example key generator page](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx)

The encryption iv (initial vector) will be generated for each request and will be attach in the text of the response in the following format: 

```
{iv}.{responseText}
```

# Usage
1. (Optional) User must write any map of params necessary by the execution function into the library space in the RTDB in a field with key `p`
2. To execute the function the code of the function must be writed in a field with key `x`

### Now the execution of the function is launched.

3. Once the execution finish, the response of the function will be return in a link that will be in the `r` field in the RTDB library space.

# Implement new functions
Requirements:
- Function must return a Promise
- Function Promise result could be a undefined, null for no reponse, a string or a stringif-able object for response or an error for console print and no response.

Steps:
1. Add the function javascript file in the Firebase functions directory
2. Add the funtion with the following format:
```
module.exports = {
	yourFunctionName( paramsMap ) {
		return new Promise((resolve, reject) => {

            ///////////////
            // Your code
            ///////////////

			return resolve('Result')
		})
	},
}
```
3. Add the reference to this function in the configuration file into the functionsMap with the execution code and the encryption way of your preference
4. Deploy the code into Firebase Functions
