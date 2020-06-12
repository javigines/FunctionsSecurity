# Firebase Security Addon
Execution your Google Cloud Functions through a database writing

# Beneficies
Extra security execution layer offered by Firebase Database Writting Rules

# Installation
1. Introduce the lib folder into your functions folder
2. Configure the configuration file with your preferences
3. Include the following line in your index file:
```
exports["castFunctions"] = require("./lib/functionExecution")
```
4. (Optional) If you want on new user creation it appears with the functions configuration in your DB, include the following line in your index file:
```
exports["onUserCreation"] = require("./lib/accountCreationAddon")
```


# Configuration
- `paths`
    - `userFunctionsPath`: Specific user path that you want the library use for work.

- `functionsMap`: Map that indicate the code (entry point of the execution) as the key and the function to execute (It will need to import the functions modules into the configuration module)