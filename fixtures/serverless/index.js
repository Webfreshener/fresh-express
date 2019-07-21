const awsServerlessExpress = require('aws-serverless-express');
module.exports.handler = async (event, context) => {
    console.log("hello");
    const server = awsServerlessExpress.createServer(
        require("../../index")({
            exec: (service) => {
                service.app.all('/*', (req, res) => {
                    res.send('process ' + process.pid + ' says hello!').end();
                });
            }
        }).exec({port: 5000, serverless: true})
    );

    awsServerlessExpress.proxy(server, event, context);
};

