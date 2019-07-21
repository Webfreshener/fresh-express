const __ = require("../../index")(
    (service) => {
        console.log("SERVICE");
        service.app.all('/*', (req, res) => {
            res.send(
                `process ${process.pid} says hello!`
            ).end();
        });
        return service;
    }
).exec({port: 5000});
