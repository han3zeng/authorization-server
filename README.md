# Authorization Server

## Architecture
* Continuous Deploymeny from github
    * by google cloud run setting
* Database: MongoDB Atlas


## Script Instruction
* `npm run get:token`: get OAuth token from google server to access gmail service
* `npm run create:env`: put all your secrets in .env.json file and run the command to create .env file
* `npm run dev`: development mode
* `npm run start`: production mode


## Secrets

```
{
  "MONGO_URI": "connect to MongoDB ATlas",
  "githubSecret": "for githug OAuth",
  "googleSecret": "for google OAuth",
  "gmailSecret": "for accessing gmail service",
  "gmailClientId": "for accessing gmail service",
  "iterations": "for creating hash",
  "randomBytesSize": "for creating hash",
  "token": "a json string for gmail service"
}
```

## PORT
* default: 8080
* process.env.PORT: set by the cloud run

## Origin
* dev: localhost
* prod: https://authorization-server-7kgn6zbeya-uc.a.run.app
