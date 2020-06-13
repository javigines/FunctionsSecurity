# Firebase Security Addon
Execution your Google Cloud Functions through a database writing.

# Beneficies
- Extra security execution layer using Firebase Database Writting Rules.
- Prevent functions calls abuse. Which could cause invoice problems by functions calls.

# Installation

1. Introduce the lib folder into your functions folder.
2. Configure the configuration file with your preferences.
3. Include the following line in your index file:
```
const admin = require('firebase-admin')
admin.initializeApp()

exports["castFunctions"] = require("./lib/functionExecution")
```
4. (Optional) If you want on new user creation it appears with the functions configuration in your DB, include the following line in your index file:
```
exports["onUserCreation"] = require("./lib/accountCreationAddon")
```
5. Add `request` dependency on `package.json`


# Configuration
- `paths` (Wildcards that will be replaced: _`{userID}`_, _`{userEmail}`_, _`{userPhone}`_)
    - `userFunctionsPath`: Specific user path that you want the library use for work.
    - `userEncryptionKeyPath`: User specific encryption key for response.

- `functionsMap`: Map that indicate the code (entry point of the execution) as the key and the execution requirements.
    - `f`: Function to execute reference (It will need to import the functions modules into the configuration module).
    - `e`: Type of encryption to apply in the function response.

- `encryption`
    - `type`: Encryption type for response. Available types: `none`, `aes128`, `aes256`
    - `userPersonalized`
        - In case this is marked as `false`. The key must be stored on enviroment on _`encryption.key128`_ or _`encryption.key256`_ as required.
            ##### To save in enviroment use `firebase functions:config:set encryption.key128="THE ENCRYPTION KEY"` and deploy.

        - In case this is marked as `true`. The key will be read **IN EVERY FUNCTION CALL** (increased response times and reads from DB) from `userEncryptionKeyPath` in DB.

# Encryption with AES
Key need to be on set on _`encryption.key128`_ or _`encryption.key256`_ as required or in user space as _`k128`_ or _`k256`_ field.

##### [Example key generator page](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx)

The encryption iv (initial vector) will be generated for each request and will be attach in the text of the response in the following format: 

```
{iv}.{responseText}
```
