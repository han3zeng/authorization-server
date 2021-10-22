# Authorization Server

## Architecture
* Continuous Deploymeny from github
    * by google cloud run setting
* Database: MongoDB Atlas


## Script Instruction
* `npm run get:token`: get OAuth token from google server to access gmail service
* `npm run create:env`: put all your secrets in .env.json file and run the command to create .env file
    * the file is used for google secret and cloud run
* `npm run dev`: development mode
* `npm run start`: production mode


## Secrets

* .env.json file example

```
{
  "MONGO_URI": "connect to MongoDB ATlas",
  "githubSecret": "for githug OAuth",
  "googleSecret": "for google OAuth",
  "gmailSecret": "for accessing gmail service",
  "gmailClientId": "for accessing gmail service",
  "iterations": "for creating hash",
  "randomBytesSize": "for creating hash",
  "token": {JSON.stringfied token object}
}
```

* steps
    1. `npm run get:token`
        * the gmail OAuth app is on development mode, so I have to update token manually in every 7 days
          1. remove app consent from google account
          2. run the command to consent app and fetch new token
    2. create a file called `.env.json`
    3. `npm run create:env`
    4. copy secrets and paste it to where you serve

## PORT
* default: 8080
* process.env.PORT: set by the cloud run

## Origin
* dev: localhost
* prod: https://authorization-server-7kgn6zbeya-uc.a.run.app
