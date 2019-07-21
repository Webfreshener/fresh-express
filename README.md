# fresh-express 

[Online Developer Documentation](https://webfreshener.github.io/fresh-express/)

### Goals 
 * Provide easy and intuitive one-step setup of Express Server

### Table of Contents

**[Installation Instructions](#installation-instructions)**

**[Usage Examples](#usage-examples)**

#### Installation Instructions
```
$ npm i -s fresh-express 
```

#### Usage Example 
```
require("fresh-express")
({
    exec: (service) => {
        service.app.get('/', (req, res) => res.send('Hello World!'));
        return service;
    },
}).exec({port: 5000,});

```

#### Fresh Express Configuration Options ####
| Method        | Arguments | Description  | Default |
|:--------------|:----------|:-------|
| host | string | host address |  0.0.0.0 |
| port | number | port number to listen on | 3000 |
| cluster | boolean / object | enables / configures clustering | true |
| awsLambda | 


#### Fresh Express Class ####
| Method        | Arguments | Description  |
|:--------------|:----------|:-------|
| constructor | ...pipesOrSchemas | Class constructor method |
| exec | config | starts express server with config |
